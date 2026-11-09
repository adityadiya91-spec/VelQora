import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

import {
  villages,
  pickupPoints,
  vehicleTypes,
  drivers as initialDrivers,
  buildDemoBookings,
} from "@/lib/mock-data";

import { getStorage, setStorage } from "@/lib/storage";
import { useProfile } from "@/contexts/ProfileContext";
import { runMatchingAlgorithm } from "@/lib/api/matchingEngine";
import { processPayment as processMockPayment } from "@/lib/api/paymentAdapter";
import { saveBookingToFirestore } from "@/lib/firebase";

const DataContext = createContext(null);

const makeId = () => {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
};

export function DataProvider({ children }) {
  const { profile, currentUser } = useProfile();

  const [bookings, setBookings] = useState(() => {
    return getStorage("velqora_bookings", []);
  });

  const [drivers, setDrivers] = useState(() => {
    return getStorage("velqora_drivers", initialDrivers);
  });

  const [sharedTrips, setSharedTrips] = useState(() => {
    return getStorage("velqora_shared_trips", []);
  });

  // Persist
  useEffect(() => {
    setStorage("velqora_bookings", bookings);
  }, [bookings]);

  useEffect(() => {
    setStorage("velqora_drivers", drivers);
  }, [drivers]);

  useEffect(() => {
    setStorage("velqora_shared_trips", sharedTrips);
  }, [sharedTrips]);

  // Seed demo data on initial load
  useEffect(() => {
    const seeded = getStorage("velqora_demo_seeded", false);

    if (!seeded || bookings.length === 0) {
      const entrepreneurName =
        profile?.business_name || profile?.full_name || "Kisan Agro Foods";

      const demo = buildDemoBookings(entrepreneurName);
      setBookings(demo);
      setStorage("velqora_demo_seeded", true);
    }
  }, [profile]);

  const getBooking = (id) => {
    return bookings.find((booking) => booking.id === id || booking.parcel_id === id || booking.tracking_id === id) || null;
  };

  const createBooking = (input) => {
    const parcelNumber = Math.floor(100000 + Math.random() * 900000);
    const parcel_id = `PCL-${parcelNumber}`;

    const dateCode = new Date()
      .toISOString()
      .slice(2, 10)
      .replace(/-/g, "");

    const tracking_id = `VQ-${dateCode}-${String(parcelNumber).slice(-4)}`;

    const status = input.mode === "shared" ? "pending_match" : "assigned";

    const driver =
      input.mode === "priority"
        ? drivers.find((d) => d.status === "available") || drivers[0]
        : null;

    const fare = input.fare || {};
    const now = new Date();

    const booking = {
      id: parcel_id,
      parcel_id,
      tracking_id,
      entrepreneur_name:
        input.entrepreneur_name || profile?.business_name || profile?.full_name || "Entrepreneur",
      customer_phone: input.customer_phone || profile?.phone || "+91 98220 12345",
      recipient_name: input.recipient_name || "Mandi Distribution Hub",
      recipient_phone: input.recipient_phone || "+91 98901 23456",

      pickup_village: input.pickupVillage?.name || input.pickup_village || "",
      pickup_landmark: input.pickup_landmark || "",
      destination: input.destinationVillage?.name || input.destination || "",

      pickup_date: input.pickup_date || now.toISOString().slice(0, 10),
      pickup_time: input.pickup_time || "08:00",
      dispatch_window: input.dispatch_window || "08:00-12:00",

      weight_kg: Number(input.weight_kg || 0),
      dimensions: input.dimensions || "",
      length_ft: input.length_ft || null,
      width_ft: input.width_ft || null,
      height_ft: input.height_ft || null,
      volume_cbm: input.volume_cbm || null,
      parcel_image: input.parcel_image || input.image_url || null,
      handling_notes: input.handling_notes || "Standard freight handling. Keep protected from moisture.",
      category: input.category || "other",
      vehicle_type: input.vehicleType?.code || input.vehicle_type || "mini_tempo",
      mode: input.mode || "shared",

      status,

      distance_km: fare.distance_km || 35,
      fare_base: fare.fare_base || 0,
      fare_allocation: fare.fare_allocation || 0,
      fare_extras: fare.fare_extras || 0,
      fare_tax: fare.fare_tax || 0,
      fare_discount: fare.fare_discount || 0,
      fare_total: fare.fare_total || 0,
      individual_total: fare.individual_total || 0,
      savings: fare.savings || 0,
      capacity_share: fare.capacity_share || 0,

      payment_status: "unpaid",

      driver_name: driver?.full_name || null,
      driver_phone: driver?.phone || null,
      vehicle_number: driver?.vehicle_number || null,

      eta:
        input.mode === "priority"
          ? new Date(now.getTime() + 3 * 3600000).toISOString()
          : null,

      cancel_reason: null,

      pickup_lat: input.pickupVillage?.lat || villages.find(v => v.name === input.pickup_village)?.lat || 18.152,
      pickup_lng: input.pickupVillage?.lng || villages.find(v => v.name === input.pickup_village)?.lng || 74.576,
      destination_lat: input.destinationVillage?.lat || villages.find(v => v.name === input.destination)?.lat || 18.278,
      destination_lng: input.destinationVillage?.lng || villages.find(v => v.name === input.destination)?.lng || 74.163,

      payments: [],

      timeline: [
        {
          id: makeId(),
          status,
          note:
            status === "assigned"
              ? "Priority vehicle dispatched"
              : "Waiting for compatible shared route",
          location: input.pickupVillage?.name || input.pickup_village || "Rural Hub",
          occurred_at: now.toISOString(),
        },
      ],
    };

    if (driver) {
      booking.timeline.push({
        id: makeId(),
        status: "assigned",
        note: `Driver ${driver.full_name} assigned (${driver.vehicle_number})`,
        location: booking.pickup_village,
        occurred_at: new Date().toISOString(),
      });
    }
    booking.user_id = currentUser?.uid || profile?.uid || "guest";

    setBookings((prev) => [booking, ...prev]);
    saveBookingToFirestore(booking);
    return booking;
  };

  const updateBookingStatus = (bookingId, status, note = "", location = "") => {
    setBookings((prev) =>
      prev.map((booking) => {
        if (booking.id !== bookingId) return booking;

        return {
          ...booking,
          status,
          timeline: [
            ...booking.timeline,
            {
              id: makeId(),
              status,
              note: note || `Status updated to ${status.replace("_", " ")}`,
              location: location || booking.pickup_village,
              occurred_at: new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  const assignDriver = (bookingId, specificDriver = null) => {
    const driver =
      specificDriver ||
      drivers.find((d) => d.status === "available") ||
      drivers[0];

    setBookings((prev) =>
      prev.map((booking) => {
        if (booking.id !== bookingId) return booking;

        return {
          ...booking,
          status: "assigned",
          driver_name: driver.full_name,
          driver_phone: driver.phone,
          vehicle_number: driver.vehicle_number,
          eta: new Date(Date.now() + 3 * 3600000).toISOString(),
          timeline: [
            ...booking.timeline,
            {
              id: makeId(),
              status: "assigned",
              note: `Driver ${driver.full_name} assigned (${driver.vehicle_number})`,
              location: booking.pickup_village,
              occurred_at: new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  const payBooking = async (bookingId, method = "upi") => {
    const target = getBooking(bookingId);
    const amount = target ? target.fare_total : 0;

    const res = await processMockPayment({ bookingId, amount, method });

    setBookings((prev) =>
      prev.map((booking) => {
        if (booking.id !== bookingId) return booking;

        return {
          ...booking,
          payment_status: "paid",
          payments: [
            ...booking.payments,
            {
              id: makeId(),
              booking_id: booking.id,
              tracking_id: booking.tracking_id,
              amount: booking.fare_total,
              method,
              status: "paid",
              reference: res.reference,
              paid_at: res.paid_at,
            },
          ],
          timeline: [
            ...booking.timeline,
            {
              id: makeId(),
              status: booking.status,
              note: `Payment of ₹${booking.fare_total} confirmed via ${method.toUpperCase()} (${res.reference})`,
              location: booking.pickup_village,
              occurred_at: new Date().toISOString(),
            },
          ],
        };
      })
    );

    return res;
  };

  const runMatchingEngine = () => {
    const res = runMatchingAlgorithm(bookings, drivers, villages, vehicleTypes);
    setBookings(res.updatedBookings);
    if (res.matchedTrips.length > 0) {
      setSharedTrips((prev) => [...res.matchedTrips, ...prev]);
    }
    return res;
  };

  // Driver action helpers
  const acceptTrip = (bookingId, driverInfo) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: "assigned",
          driver_name: driverInfo.full_name,
          driver_phone: driverInfo.phone,
          vehicle_number: driverInfo.vehicle_number,
          eta: new Date(Date.now() + 2 * 3600000).toISOString(),
          timeline: [
            ...b.timeline,
            {
              id: makeId(),
              status: "assigned",
              note: `Trip accepted by driver ${driverInfo.full_name}`,
              location: b.pickup_village,
              occurred_at: new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  const advanceDriverStatus = (bookingId, nextStatus, note = "") => {
    const defaultNotes = {
      pickup_started: "Driver is en route to registered pickup point",
      picked_up: "Parcel verified, weighed, and loaded onto shared vehicle",
      in_transit: "Shared vehicle departed toward destination cluster",
      delivered: "Parcel safely delivered and verified at destination point",
    };

    updateBookingStatus(bookingId, nextStatus, note || defaultNotes[nextStatus] || "");
  };

  // Payments aggregate list
  const allPayments = useMemo(() => {
    const list = [];
    bookings.forEach((b) => {
      if (b.payments && b.payments.length > 0) {
        b.payments.forEach((p) => list.push({ ...p, entrepreneur_name: b.entrepreneur_name }));
      }
    });
    return list.sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at));
  }, [bookings]);

  // Admin stats computation
  const adminStats = useMemo(() => {
    const totalBookings = bookings.length;
    const activeShipments = bookings.filter((b) =>
      ["assigned", "pickup_started", "picked_up", "in_transit"].includes(b.status)
    ).length;
    const pendingMatches = bookings.filter((b) => b.status === "pending_match").length;
    const deliveredCount = bookings.filter((b) => b.status === "delivered").length;

    const totalRevenue = bookings
      .filter((b) => b.payment_status === "paid")
      .reduce((sum, b) => sum + (Number(b.fare_total) || 0), 0);

    const totalSavings = bookings.reduce(
      (sum, b) => sum + (Number(b.savings) || 0),
      0
    );

    return {
      totalBookings,
      activeShipments,
      pendingMatches,
      deliveredCount,
      totalRevenue,
      totalSavings,
      totalDrivers: drivers.length,
      totalVillages: villages.length,
    };
  }, [bookings, drivers]);

  return (
    <DataContext.Provider
      value={{
        villages,
        pickupPoints,
        vehicleTypes,
        drivers,
        bookings,
        sharedTrips,
        allPayments,
        adminStats,
        getBooking,
        createBooking,
        updateBookingStatus,
        assignDriver,
        payBooking,
        runMatchingEngine,
        acceptTrip,
        advanceDriverStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within DataProvider");
  }
  return ctx;
}