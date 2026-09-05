import { supabase } from '@/lib/supabaseClient';

/**
 * Send Phone OTP for Login / Signup
 * @param {string} phone - Phone number with country code (e.g. +919876543210)
 */
export async function signInWithOtp(phone) {
  try {
    let formattedPhone = (phone || '').trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+91${formattedPhone.replace(/^0+/, '')}`;
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });
    if (error) throw error;
    return { success: true, formattedPhone, data };
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Verify Phone OTP and save metadata (role, full_name)
 * @param {string} phone
 * @param {string} token - 6 digit OTP token
 * @param {string} role - 'farmer' | 'consumer' | 'trader'
 * @param {string} fullName
 * @param {string} district
 */
export async function verifyOtp(phone, token, role = 'farmer', fullName = 'User', district = 'Nashik') {
  try {
    let formattedPhone = (phone || '').trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+91${formattedPhone.replace(/^0+/, '')}`;
    }

    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: 'sms',
      options: {
        data: {
          full_name: fullName,
          role: role,
          district: district,
        },
      },
    });

    if (error) throw error;

    // Ensure profile row exists/updates in public.profiles
    if (data?.user) {
      await supabase.from('profiles').upsert([
        {
          id: data.user.id,
          phone: formattedPhone,
          full_name: fullName,
          role: role,
          district: district,
          updated_at: new Date().toISOString(),
        },
      ]);
    }

    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send Email OTP (6-digit code or Magic Link to email inbox)
 * @param {string} email
 * @param {string} role - 'farmer' | 'consumer' | 'trader'
 */
export async function sendEmailOtp(email, role = 'farmer') {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: (email || '').trim(),
      options: {
        data: { role: role },
        shouldCreateUser: true,
      },
    });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending Email OTP:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Verify 6-digit Email OTP token
 * @param {string} email
 * @param {string} token
 * @param {string} role
 * @param {string} fullName
 * @param {string} district
 */
export async function verifyEmailOtp(email, token, role = 'farmer', fullName = 'User', district = 'Nashik') {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: (email || '').trim(),
      token: (token || '').trim(),
      type: 'email',
      options: {
        data: {
          full_name: fullName,
          role: role,
          district: district,
        },
      },
    });

    if (error) throw error;

    if (data?.user) {
      await supabase.from('profiles').upsert([
        {
          id: data.user.id,
          email: (email || '').trim(),
          full_name: fullName,
          role: role,
          district: district,
          updated_at: new Date().toISOString(),
        },
      ]);
    }

    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    console.error('Error verifying Email OTP:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sign in with Google OAuth 2.0 Direct Single Sign-On
 * @param {string} role - Selected user role
 */
export async function signInWithGoogle(role = 'farmer') {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        data: {
          role: role,
        },
      },
    });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error Google OAuth:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch User Profile from public.profiles
 * @param {string} userId
 */
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { success: true, profile: data };
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Update User Profile
 * @param {string} userId
 * @param {object} profileData
 */
export async function updateProfile(userId, profileData) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select();

    if (error) throw error;
    return { success: true, profile: data[0] };
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sign Out active session
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error.message);
    return { success: false, error: error.message };
  }
}
