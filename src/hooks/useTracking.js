import { useData } from "@/contexts/DataContext";

export function useTracking(bookingId) {
  const { getBooking, updateBookingStatus, assignDriver } = useData();
  const booking = getBooking(bookingId);

  return {
    booking,
    timeline: booking?.timeline || [],
    status: booking?.status,
    eta: booking?.eta,
    driver: booking?.driver_name
      ? {
          name: booking.driver_name,
          phone: booking.driver_phone,
          vehicle_number: booking.vehicle_number,
        }
      : null,
    updateStatus: (newStatus, note) => updateBookingStatus(bookingId, newStatus, note),
    assignDriver: () => assignDriver(bookingId),
  };
}

export default useTracking;
