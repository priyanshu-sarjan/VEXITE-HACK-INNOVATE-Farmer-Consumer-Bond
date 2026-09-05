import { supabase } from '@/lib/supabaseClient';

/**
 * Insert IoT Telemetry Reading to public.iot_telemetry
 * @param {object} record
 */
export async function insertTelemetryData(record) {
  try {
    const { data, error } = await supabase
      .from('iot_telemetry')
      .insert([
        {
          order_id: record.orderId || null,
          device_id: record.deviceId || 'ESP32-HUB-NASHIK-01',
          temperature_c: record.temperatureC,
          humidity_rh: record.humidityRh,
          ethylene_ppm: record.ethylenePpm || 0.14,
          remaining_shelf_life_days: record.remainingShelfLifeDays || 12.5,
          recorded_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, telemetry: data[0] };
  } catch (error) {
    console.warn('Telemetry log notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Real-time subscription to public.iot_telemetry
 * @param {function} callback
 */
export function subscribeToTelemetry(callback) {
  const channel = supabase
    .channel('public:iot_telemetry')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'iot_telemetry' },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
