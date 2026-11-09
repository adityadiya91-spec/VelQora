import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";

const coralDot = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 16px;
      height: 16px;
      border-radius: 9999px;
      background: #FF7958;
      border: 2px solid white;
      box-shadow: 0 8px 18px rgba(0,0,0,0.18);
    "></div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export function TrackingMap({ booking }) {
  if (!booking?.pickup_lat || !booking?.destination_lat) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-white/10 text-sm text-white/60">
        Map preview unavailable
      </div>
    );
  }

  const pickup = [booking.pickup_lat, booking.pickup_lng];
  const drop = [booking.destination_lat, booking.destination_lng];

  const midpoint = [
    (pickup[0] + drop[0]) / 2,
    (pickup[1] + drop[1]) / 2,
  ];

  const vehiclePosition =
    booking.status === "delivered"
      ? drop
      : ["assigned", "pickup_started", "picked_up", "in_transit"].includes(
          booking.status
        )
      ? midpoint
      : pickup;

  return (
    <div className="h-64 overflow-hidden rounded-lg">
      <MapContainer
        center={midpoint}
        zoom={9}
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="velqora-map-tiles"
        />

        <Polyline positions={[pickup, drop]} color="#FF7958" weight={4} />

        <Marker position={pickup} icon={coralDot} />
        <Marker position={drop} icon={coralDot} />
        <Marker position={vehiclePosition} icon={coralDot} />
      </MapContainer>
    </div>
  );
}