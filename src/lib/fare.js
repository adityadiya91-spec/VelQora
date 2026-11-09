function toRad(value) {
  return (value * Math.PI) / 180;
}

export function getDistanceKm(lat1, lng1, lat2, lng2) {
  if (!lat1 || !lng1 || !lat2 || !lng2) return 0;

  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // 1.25 routing factor
  return Math.max(1, Math.round(R * c * 1.25));
}

export function calculateFare({
  pickupVillage,
  destinationVillage,
  weight_kg = 0,
  mode = "shared",
  vehicleType,
}) {
  if (!pickupVillage || !destinationVillage || !vehicleType) {
    return {
      distance_km: 0,
      fare_base: 0,
      fare_allocation: 0,
      fare_extras: 0,
      fare_tax: 0,
      fare_discount: 0,
      fare_total: 0,
      individual_total: 0,
      savings: 0,
      capacity_share: 0,
    };
  }

  const distance_km = getDistanceKm(
    pickupVillage.lat,
    pickupVillage.lng,
    destinationVillage.lat,
    destinationVillage.lng
  );

  const fare_base = Math.round(vehicleType.rate_per_km * distance_km);

  let fare_allocation = fare_base;

  if (mode === "shared") {
    const shareRatio = Math.min(
      0.75,
      0.25 + 0.5 * (Number(weight_kg || 0) / vehicleType.capacity_kg)
    );

    fare_allocation = Math.round(fare_base * shareRatio);
  }

  const handling_fee = 30;
  const weight_surcharge =
    Number(weight_kg || 0) > 10
      ? Math.ceil((Number(weight_kg || 0) - 10) / 5) * 20
      : 0;

  const fare_extras = handling_fee + weight_surcharge;
  const fare_discount = 0;

  const fare_tax = Math.round(
    (fare_allocation + fare_extras - fare_discount) * 0.1
  );

  const fare_total = fare_allocation + fare_extras - fare_discount + fare_tax;

  const individual_total = fare_base + fare_extras;
  const savings = Math.max(0, individual_total - fare_total);

  const capacity_share = vehicleType.capacity_kg
    ? Number(weight_kg || 0) / vehicleType.capacity_kg
    : 0;

  return {
    distance_km,
    fare_base,
    fare_allocation,
    fare_extras,
    fare_tax,
    fare_discount,
    fare_total,
    individual_total,
    savings,
    capacity_share,
  };
}