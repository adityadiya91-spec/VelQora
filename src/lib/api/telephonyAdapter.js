/**
 * Mock Telephony / IVR Adapter
 * Simulates keypad phone voice menu and DTMF prompt bookings for rural entrepreneurs without smartphones.
 * Keypad inputs map village codes, registered pickup point codes, PIN codes, and weight.
 * Clearly labeled mock module.
 */

export async function simulateIVRBooking({
  caller_phone,
  village_code,
  pickup_point_code,
  destination_code,
  weight_kg,
  category = "produce",
  dispatch_window = "08:00-12:00",
}) {
  await new Promise((res) => setTimeout(res, 350));

  const confirmationCode = `IVR-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    success: true,
    is_mock: true,
    telephony_session_id: `IVR-CALL-${Date.now()}`,
    confirmation_code: confirmationCode,
    caller_phone,
    input_data: {
      village_code,
      pickup_point_code,
      destination_code,
      weight_kg: Number(weight_kg || 10),
      category,
      dispatch_window,
    },
    message: `Mock IVR booking simulated successfully for phone ${caller_phone}. SMS confirmation queued.`,
    note: "Rural IVR allows keypad phone booking without GPS dependency via standardized village & point codes.",
  };
}

export default {
  simulateIVRBooking,
};
