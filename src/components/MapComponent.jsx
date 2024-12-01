import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ userLocation, hospitals }) => {
  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg bg-gray-200">
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={userLocation}>
          <Popup>You are here!</Popup>
        </Marker>
        {hospitals.map((hospital, index) => (
          <Marker key={index} position={[hospital.lat, hospital.lon]}>
            <Popup>{hospital.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
