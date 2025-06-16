import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function Map({ locations = [], className }) {
  const defaultCenter = [21.0285, 105.8542]; // Hà Nội
  let center = defaultCenter;
  let zoom = 13;

  const validLocations = locations.filter(
    (loc) => typeof loc.lat === "number" && typeof loc.lng === "number" && !isNaN(loc.lat) && !isNaN(loc.lng)
  );

  if (validLocations.length > 0) {
    const avgLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
    const avgLng = validLocations.reduce((sum, loc) => sum + loc.lng, 0) / validLocations.length;
    center = [avgLat, avgLng];
    zoom = validLocations.length === 1 ? 15 : 10;
  }

  return (
    <div className={className} style={{ height: "24rem", width: "100%", background: "#e9ecef" }}>
      {validLocations.length === 0 ? (
        <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center">
          Không có địa điểm hợp lệ để hiển thị
        </div>
      ) : (
        <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {validLocations.map((location) => (
            <Marker key={location.id} position={[location.lat, location.lng]} icon={defaultIcon}>
              <Popup>{location.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

export default Map;