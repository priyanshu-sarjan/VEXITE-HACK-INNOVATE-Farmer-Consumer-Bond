import { supabase } from '@/lib/supabaseClient';

/**
 * Send Phone OTP for Login / Signup
 * @param {string} phone - Phone number with country code (e.g. +919876543210)
 */
export async function signInWithOtp(phone) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });
    if (error) throw error;
    return { success: true, data };
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
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
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
          phone: phone,
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
 * Sign in with Google OAuth Provider
 */
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/`,
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
