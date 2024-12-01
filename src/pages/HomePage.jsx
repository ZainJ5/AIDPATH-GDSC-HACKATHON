import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HomePage = () => {
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [travelOptions, setTravelOptions] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        fetchNearbyHospitals(latitude, longitude);
      },
      (error) => console.error("Error fetching location:", error)
    );
  }, []);

  const fetchNearbyHospitals = async (lat, lon) => {
    try {
      const north = lat + 0.2;
      const south = lat - 0.2;
      const east = lon + 0.2;
      const west = lon - 0.2;
  
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=hospital&viewbox=${west},${north},${east},${south}&bounded=1&limit=10`
      );
      const data = await response.json();
  
      setHospitals(
        data.map((hospital) => ({
          name: hospital.display_name,
          lat: parseFloat(hospital.lat),
          lon: parseFloat(hospital.lon),
        }))
      );
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital);
    setTravelOptions([
      { type: "Ambulance", time: "10 minutes", distance: "5 km" },
      { type: "Cab", time: "7 minutes", distance: "5 km" },
    ]);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-white p-4 border-r-2">
        <h2 className="text-xl font-semibold mb-4">Nearby Hospitals</h2>
        <div className="space-y-4">
          {hospitals.map((hospital, index) => (
            <div
              key={index}
              className="cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => handleHospitalClick(hospital)}
            >
              <p>{hospital.name}</p>
            </div>
          ))}
        </div>
        {selectedHospital && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Travel Options</h3>
            <ul className="space-y-2">
              {travelOptions.map((option, index) => (
                <li key={index} className="flex justify-between p-2 border-b">
                  <span>{option.type}</span>
                  <span>{option.time}</span>
                  <span>{option.distance}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex-1">
        {userLocation ? (
          <MapContainer
            center={userLocation} // Fix here: Use array [latitude, longitude]
            zoom={13}
            scrollWheelZoom={false}
            className="h-full" // Make sure the map takes up enough height
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={userLocation}>
              <Popup>Your Location</Popup>
            </Marker>
            {hospitals.map((hospital, index) => (
              <Marker
                key={index}
                position={[hospital.lat, hospital.lon]}
                eventHandlers={{
                  click: () => handleHospitalClick(hospital),
                }}
              >
                <Popup>{hospital.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <p className="text-center text-lg">Fetching your location...</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
