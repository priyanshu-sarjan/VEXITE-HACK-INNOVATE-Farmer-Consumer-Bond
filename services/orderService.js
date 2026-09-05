import { supabase } from '@/lib/supabaseClient';

/**
 * Create a new Order with Smart Escrow Tracking
 * @param {object} orderData
 */
export async function createOrder(orderData) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          listing_id: orderData.listingId || null,
          buyer_id: orderData.buyerId,
          farmer_id: orderData.farmerId,
          quantity_kg: orderData.quantityKg,
          total_price: orderData.totalPrice,
          order_status: 'PENDING',
          escrow_status: 'LOCKED',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, order: data[0] };
  } catch (error) {
    console.error('Error creating order:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch orders for a buyer or farmer
 * @param {string} userId
 * @param {string} role - 'buyer' | 'farmer' | 'consumer' | 'trader'
 */
export async function getUserOrders(userId, role = 'buyer') {
  try {
    const column = (role === 'farmer') ? 'farmer_id' : 'buyer_id';
    const { data, error } = await supabase
      .from('orders')
      .select('*, listing:produce_listings(crop_name, category, price_per_kg, image_url), buyer:profiles!orders_buyer_id_fkey(full_name, phone, district), farmer:profiles!orders_farmer_id_fkey(full_name, phone, district)')
      .eq(column, userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, orders: data || [] };
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    return { success: false, error: error.message, orders: [] };
  }
}

/**
 * Update Order & Escrow Status
 * @param {string} orderId
 * @param {string} orderStatus - 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
 * @param {string} escrowStatus - 'LOCKED' | 'RELEASED' | 'REFUNDED'
 */
export async function updateOrderStatus(orderId, orderStatus, escrowStatus) {
  try {
    const updates = {};
    if (orderStatus) updates.order_status = orderStatus;
    if (escrowStatus) updates.escrow_status = escrowStatus;

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return { success: true, order: data[0] };
  } catch (error) {
    console.error('Error updating order:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Release Escrow Funds to Farmer
 * @param {string} orderId
 */
export async function releaseEscrow(orderId) {
  return updateOrderStatus(orderId, 'DELIVERED', 'RELEASED');
}

/**
 * Real-time subscription to public.orders
 * @param {function} callback
 */
export function subscribeToOrders(callback) {
  const channel = supabase
    .channel('public:orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
