/**
 * Deterministic Shared Shipment Matching Engine
 * Aggregates rural parcels across nearby Maharashtra village clusters into shared vehicles.
 */

import { getDistanceKm } from "../fare.js";

/**
 * Parses approximate volume from dimensions string or falls back to weight heuristic
 */
function estimateVolumeCbm(dimensions, weight_kg) {
  if (dimensions && typeof dimensions === "string") {
    // Try parsing e.g. "4 x 3 x 2 ft" or "2 x 2 x 1"
    const match = dimensions.match(/(\d+(\.\d+)?)\s*[xX*]\s*(\d+(\.\d+)?)\s*[xX*]\s*(\d+(\.\d+)?)/);
    if (match) {
      const l = parseFloat(match[1]);
      const w = parseFloat(match[3]);
      const h = parseFloat(match[5]);
      // Assuming feet to cbm (1 cu ft = 0.0283 cbm)
      return Math.round((l * w * h * 0.0283) * 100) / 100;
    }
  }
  // Heuristic: ~0.04 cbm per 10kg for general agricultural/goods packaging
  return Math.max(0.05, Math.round(((Number(weight_kg || 10) / 10) * 0.04) * 100) / 100);
}

/**
 * Evaluates candidates for shared routing
 */
export function runMatchingAlgorithm(bookings, availableDrivers, villages, vehicleTypes) {
  const pending = bookings.filter(
    (b) => b.mode === "shared" && b.status === "pending_match"
  );

  if (pending.length === 0) {
    return {
      matchedCount: 0,
      matchedTrips: [],
      updatedBookings: bookings,
      message: "No pending shared bookings found for matching corridor.",
    };
  }

  const villageMap = new Map(villages.map((v) => [v.name.toLowerCase(), v]));
  const updatedBookings = [...bookings];
  const matchedTrips = [];
  const assignedBookingIds = new Set();

  // Find an available driver or fallback to first
  let driverIndex = 0;
  const driversPool = availableDrivers.filter((d) => d.status === "available");
  const fallbackDriver = availableDrivers[0];

  for (let i = 0; i < pending.length; i++) {
    const primary = pending[i];
    if (assignedBookingIds.has(primary.id)) continue;

    const cluster = [primary];
    const p1 = villageMap.get(primary.pickup_village.toLowerCase());
    const d1 = villageMap.get(primary.destination.toLowerCase());

    const vehicleTypeObj =
      vehicleTypes.find((vt) => vt.code === primary.vehicle_type) || vehicleTypes[0];

    let currentWeight = Number(primary.weight_kg || 0);
    let currentVolume = estimateVolumeCbm(primary.dimensions, primary.weight_kg);

    for (let j = i + 1; j < pending.length; j++) {
      const candidate = pending[j];
      if (assignedBookingIds.has(candidate.id)) continue;

      // 1. Time window overlap
      const dateMatch = !primary.pickup_date || !candidate.pickup_date || primary.pickup_date === candidate.pickup_date;
      const windowMatch = !primary.dispatch_window || !candidate.dispatch_window || primary.dispatch_window === candidate.dispatch_window;
      if (!dateMatch || !windowMatch) continue;

      // 2. Route Corridor check
      const p2 = villageMap.get(candidate.pickup_village.toLowerCase());
      const d2 = villageMap.get(candidate.destination.toLowerCase());

      const pickupDist = p1 && p2 ? getDistanceKm(p1.lat, p1.lng, p2.lat, p2.lng) : 0;
      const dropDist = d1 && d2 ? getDistanceKm(d1.lat, d1.lng, d2.lat, d2.lng) : 0;

      // Pickup villages within 30km corridor, destinations within 40km
      if (pickupDist > 30 || dropDist > 40) continue;

      // 3. Capacity weight check
      const candWeight = Number(candidate.weight_kg || 0);
      if (currentWeight + candWeight > vehicleTypeObj.capacity_kg) continue;

      // 4. Volume check
      const candVolume = estimateVolumeCbm(candidate.dimensions, candidate.weight_kg);
      if (currentVolume + candVolume > vehicleTypeObj.volume_cbm) continue;

      // 5. Detour budget: matched route adds <= 25% distance
      const leg1 = primary.distance_km || 30;
      const leg2 = candidate.distance_km || 30;
      const longestLeg = Math.max(leg1, leg2);
      const estimatedSharedRoute = longestLeg + Math.round((pickupDist + dropDist) * 0.4);

      if (estimatedSharedRoute > longestLeg * 1.25) continue;

      // Add to shared batch!
      cluster.push(candidate);
      currentWeight += candWeight;
      currentVolume += candVolume;
      assignedBookingIds.add(candidate.id);
    }

    // Always assign if single or multi in cluster
    const assignedDriver = driversPool[driverIndex] || fallbackDriver;
    driverIndex = (driverIndex + 1) % (driversPool.length || 1);

    const tripId = `TRIP-${Date.now().toString().slice(-4)}-${i + 1}`;
    const eta = new Date(Date.now() + 3 * 3600000).toISOString();

    cluster.forEach((b) => {
      assignedBookingIds.add(b.id);
      const bIdx = updatedBookings.findIndex((item) => item.id === b.id);
      if (bIdx !== -1) {
        updatedBookings[bIdx] = {
          ...updatedBookings[bIdx],
          status: "assigned",
          driver_name: assignedDriver.full_name,
          driver_phone: assignedDriver.phone,
          vehicle_number: assignedDriver.vehicle_number,
          eta,
          timeline: [
            ...(updatedBookings[bIdx].timeline || []),
            {
              id: `match_evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              status: "assigned",
              note: `Matched in shared run #${tripId} with driver ${assignedDriver.full_name}`,
              location: updatedBookings[bIdx].pickup_village,
              occurred_at: new Date().toISOString(),
            },
          ],
        };
      }
    });

    matchedTrips.push({
      trip_id: tripId,
      driver: assignedDriver,
      vehicle: vehicleTypeObj,
      total_weight_kg: currentWeight,
      capacity_kg: vehicleTypeObj.capacity_kg,
      utilization_pct: Math.round((currentWeight / vehicleTypeObj.capacity_kg) * 100),
      bookings_count: cluster.length,
      bookings: cluster.map((c) => c.id),
      created_at: new Date().toISOString(),
    });
  }

  return {
    matchedCount: assignedBookingIds.size,
    matchedTrips,
    updatedBookings,
    message: `Successfully matched ${assignedBookingIds.size} shared shipment(s) across ${matchedTrips.length} rural cluster run(s).`,
  };
}

export default {
  runMatchingAlgorithm,
};
