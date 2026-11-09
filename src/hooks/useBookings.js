import { useData } from "@/contexts/DataContext";

export function useBookings() {
  const { bookings, createBooking, updateBookingStatus, getBooking } = useData();

  const activeBookings = bookings.filter((b) =>
    ["pending_match", "assigned", "pickup_started", "picked_up", "in_transit"].includes(
      b.status
    )
  );

  const completedBookings = bookings.filter((b) => b.status === "delivered");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  return {
    bookings,
    activeBookings,
    completedBookings,
    cancelledBookings,
    createBooking,
    updateBookingStatus,
    getBooking,
  };
}

export default useBookings;
