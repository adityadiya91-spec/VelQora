/**
 * Voice Booking Bridge
 * Seamlessly interfaces completed voice IVR sessions with KarWan's existing
 * booking creation logic and parcel aggregation engine.
 */

import { villages, pickupPoints, vehicleTypes, drivers } from "../../src/lib/mock-data.js";
import { calculateFare } from "../../src/lib/fare.js";
import { runMatchingAlgorithm } from "../../src/lib/api/matchingEngine.js";

export class VoiceBookingBridge {
  constructor(options = {}) {
    // In-memory persistent bookings list for backend telephony server
    this.bookings = [];
    this.assistanceRequests = [];
  }

  setInitialBookings(existingBookings = []) {
    this.bookings = [...existingBookings];
  }

  createBookingFromIVR(session) {
    const draft = session.bookingDraft;
    const originVillage = villages.find((v) => v.name === draft.pickupVillage) || villages[0];
    const destVillage = villages.find((v) => v.name === draft.destVillage) || villages[1];
    const pPoint = pickupPoints.find((p) => p.village === originVillage.name) || pickupPoints[0];
    const vehicleType = vehicleTypes[0]; // Standard mini-tempo

    // Run existing fare formula
    const fare = calculateFare({
      pickupVillage: originVillage,
      destinationVillage: destVillage,
      weight_kg: Number(draft.weight_kg || 25),
      mode: "shared",
      vehicleType,
    });

    const parcelNumber = Math.floor(100000 + Math.random() * 900000);
    const parcel_id = `PCL-${parcelNumber}`;
    const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const tracking_id = `VQ-${dateCode}-${String(parcelNumber).slice(-4)}`;
    const now = new Date();

    const booking = {
      id: parcel_id,
      parcel_id,
      tracking_id,
      source: "VOICE", // Identifies booking entry point
      entrepreneur_name: `Keypad Shipper (${session.phone.slice(-4)})`,
      customer_phone: session.phone,
      recipient_name: "Corridor Distribution Mandi",
      recipient_phone: "+91 98901 23456",

      pickup_village: originVillage.name,
      pickup_landmark: draft.pickupLandmark || pPoint.landmark,
      destination: destVillage.name,

      pickup_date: draft.pickupDate || now.toISOString().slice(0, 10),
      pickup_time: "08:00",
      dispatch_window: draft.dispatchWindow || "08:00-12:00",

      weight_kg: Number(draft.weight_kg || 25),
      volume_cbm: Number(draft.volume_cbm || 0.1),
      category: draft.category || "produce",
      vehicle_type: vehicleType.code,
      mode: "shared",

      status: "pending_match",

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

      payment_status: "cash_on_pickup",
      driver_name: null,
      driver_phone: null,
      vehicle_number: null,
      eta: null,

      timeline: [
        {
          id: `evt_${Date.now()}_1`,
          status: "pending_match",
          note: "Voice booking confirmed via Keypad IVR. Waiting for compatible corridor route aggregation.",
          location: originVillage.name,
          occurred_at: now.toISOString(),
        },
      ],
    };

    this.bookings.unshift(booking);

    // Immediately trigger existing aggregation matching algorithm with driver pool
    const matchResult = runMatchingAlgorithm(
      this.bookings,
      drivers,
      villages,
      vehicleTypes
    );

    if (matchResult && matchResult.updatedBookings) {
      this.bookings = matchResult.updatedBookings;
      const updated = this.bookings.find((b) => b.id === booking.id);
      return updated || booking;
    }

    return booking;
  }

  getBookingsByPhone(phone) {
    const clean = String(phone).replace(/[^0-9]/g, "");
    return this.bookings.filter((b) => {
      const bPhone = String(b.customer_phone || "").replace(/[^0-9]/g, "");
      return bPhone.endsWith(clean.slice(-10));
    });
  }

  logAssistanceRequest({ phone, reason = "Keypad Operator Request", callSid }) {
    const request = {
      id: `HELP-${Date.now()}`,
      phone,
      reason,
      callSid,
      requestedAt: new Date().toISOString(),
      status: "pending_callback",
    };
    this.assistanceRequests.unshift(request);
    return request;
  }
}

export const voiceBookingBridge = new VoiceBookingBridge();
export default voiceBookingBridge;
