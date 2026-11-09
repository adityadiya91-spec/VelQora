/**
 * Mock SMS Adapter
 * Simulates rural SMS delivery for non-smartphone or SMS tracking notifications.
 */

export async function sendSMS({ phone, message }) {
  const simulatedId = `SMS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  console.info(`[Velqora Mock SMS] To: ${phone} | Content: "${message}"`);

  return {
    success: true,
    message_id: simulatedId,
    phone,
    delivered_at: new Date().toISOString(),
    is_mock: true,
    status: "delivered",
  };
}

export function buildTrackingSms({ tracking_id, pickup, destination, fare, eta }) {
  return `[Velqora] Shipment ${tracking_id} confirmed for ${pickup} -> ${destination}. Fair share: ₹${fare}. Track or call 1800-VELQORA.`;
}

export default {
  sendSMS,
  buildTrackingSms,
};
