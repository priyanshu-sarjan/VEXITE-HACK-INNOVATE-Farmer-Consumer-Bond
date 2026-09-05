import { supabase } from '@/lib/supabaseClient';

/**
 * Fetch Produce Listings from public.produce_listings
 * @param {object} filters - optional filters { category, status, farmerId }
 */
export async function getProduceListings(filters = {}) {
  try {
    let query = supabase
      .from('produce_listings')
      .select('*, farmer:profiles(full_name, phone, district, state)')
      .order('created_at', { ascending: false });

    if (filters.category && filters.category !== 'ALL') {
      query = query.eq('category', filters.category);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.farmerId) {
      query = query.eq('farmer_id', filters.farmerId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, listings: data || [] };
  } catch (error) {
    console.error('Error fetching produce listings:', error.message);
    return { success: false, error: error.message, listings: [] };
  }
}

/**
 * Create a new Produce Listing
 * @param {object} listingData
 */
export async function createProduceListing(listingData) {
  try {
    const { data, error } = await supabase
      .from('produce_listings')
      .insert([
        {
          farmer_id: listingData.farmerId,
          crop_name: listingData.cropName,
          category: listingData.category,
          quantity_kg: listingData.quantityKg,
          price_per_kg: listingData.pricePerKg,
          harvest_date: listingData.harvestDate || new Date().toISOString().split('T')[0],
          image_url: listingData.imageUrl || null,
          freshness_score: listingData.freshnessScore || 95,
          grade: listingData.grade || 'A_PREMIUM',
          status: 'AVAILABLE',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, listing: data[0] };
  } catch (error) {
    console.error('Error creating produce listing:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Upload Produce Image to Supabase Storage bucket 'produce-images'
 * @param {File} file
 */
export async function uploadProduceImage(file) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `listings/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('produce-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('produce-images')
      .getPublicUrl(filePath);

    return { success: true, publicUrl: data.publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Real-time subscription to public.produce_listings changes
 * @param {function} callback
 */
export function subscribeToListings(callback) {
  const channel = supabase
    .channel('public:produce_listings')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'produce_listings' },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
