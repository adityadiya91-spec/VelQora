/**
 * Mock Payment Adapter
 * Simulates UPI and rural payment gateway checkout.
 * Clearly labeled as a mock prototype adapter with isolated interfaces.
 */

export async function processPayment({ bookingId, amount, method = "upi" }) {
  // Simulate network latency (400ms)
  await new Promise((res) => setTimeout(res, 400));

  const timestamp = Date.now();
  const mockRef = `UPI-VELQORA-${timestamp.toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  return {
    success: true,
    booking_id: bookingId,
    amount: Number(amount),
    method,
    status: "paid",
    reference: mockRef,
    paid_at: new Date().toISOString(),
    is_mock: true,
    gateway_note: "MOCK PAYMENT: No real funds were charged. Gateway stub initialized for prototype demo.",
  };
}

export function generateMockUpiQrUrl(amount, payee = "velqora.rural@upi") {
  // Generate visual placeholder QR string for display
  return `upi://pay?pa=${payee}&pn=Velqora%20Logistics&am=${amount}&cu=INR&tn=Rural%20Shared%20Shipment`;
}

export default {
  processPayment,
  generateMockUpiQrUrl,
};
