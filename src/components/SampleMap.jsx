import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { FaAmbulance, FaHospitalAlt } from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react"; 


const SampleMap = ({ 
  center, 
  zoom, 
  onEmergencyClick, 
  showServiceButton,
  onServiceButtonClick 
}) => {
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [hospitals, setHospitals] = useState([]);
  const [showHospitals, setShowHospitals] = useState(false);
  const [route, setRoute] = useState([]);

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const userIcon = new L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="color: #2563eb; background-color: white; border-radius: 50%; padding: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  const calculateTime = (distance) => {
    const averageSpeed = 40;
    const time = distance / averageSpeed;
    const minutes = time * 60;
    return minutes.toFixed(2);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
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

      const response = await fetch(`
        https://nominatim.openstreetmap.org/search?format=json&q=hospital&viewbox=${west},${north},${east},${south}&bounded=1&limit=10
      `);
      const data = await response.json();

      const hospitalsData = data.map((hospital) => ({
        name: hospital.display_name,
        lat: parseFloat(hospital.lat),
        lon: parseFloat(hospital.lon),
      }));

      setHospitals(hospitalsData);

      let minDistance = hospitalsData.length
        ? haversineDistance(lat, lon, hospitalsData[0].lat, hospitalsData[0].lon)
        : Infinity;
      let closestHospital = null;
      hospitalsData.forEach((hospital) => {
        const distance = haversineDistance(lat, lon, hospital.lat, hospital.lon);
        if (distance < minDistance) {
          minDistance = distance;
          closestHospital = hospital;
        }
      });

      if (closestHospital) {
        fetchRouteToHospital(lat, lon, closestHospital);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const fetchRouteToHospital = async (lat, lon, hospital) => {
    const routeResponse = await fetch(
      `http://router.project-osrm.org/route/v1/driving/${lon},${lat};${hospital.lon},${hospital.lat}?overview=full&geometries=polyline
    `);
    const routeData = await routeResponse.json();

    if (routeData.routes && routeData.routes[0]) {
      const polyline = routeData.routes[0].geometry;
      const decodedRoute = decodePolyline(polyline);
      setRoute(decodedRoute);
    }
  };

  const decodePolyline = (encoded) => {
    let len = encoded.length;
    let index = 0;
    let lat = 0;
    let lon = 0;
    let decoded = [];

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dLat = (result & 1 ? ~(result >> 1) : result >> 1);
      lat += dLat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dLon = (result & 1 ? ~(result >> 1) : result >> 1);
      lon += dLon;

      decoded.push([lat / 1e5, lon / 1e5]);
    }

    return decoded;
  };

  const hospitalIcon = new L.Icon({
    iconUrl: "https://img.icons8.com/ios/452/hospital-room.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const handleEmergencyClick = () => {
    setShowHospitals(true);
    fetchNearbyHospitals(userLocation[0], userLocation[1]);
    onEmergencyClick();
  };

  return (
    <div className="p-6 bg-gray-50">
      <button
        onClick={handleEmergencyClick}
        className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg mb-6 w-full flex items-center justify-center gap-2 shadow-md"
      >
        <FaAmbulance className="text-2xl" />
        Emergency
      </button>

      {showServiceButton && (
        <button
          onClick={onServiceButtonClick}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg mb-6 w-full flex items-center justify-center gap-2 shadow-md"
        >
          <FaAmbulance className="text-2xl" />
          Find Ambulance Services
        </button>
      )}

      <div className="mt-8 relative">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "70vh", width: "100%", zIndex: 10 }}
          className="rounded-lg shadow-lg"
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <Marker position={userLocation} icon={userIcon}>
          <Popup>You are here</Popup>
          </Marker>
          {showHospitals &&
            hospitals.map((hospital, index) => {
              const distance = haversineDistance(
                userLocation[0],
                userLocation[1],
                hospital.lat,
                hospital.lon
              );
              const time = calculateTime(distance);
              return (
                <React.Fragment key={index}>
                  <Marker position={[hospital.lat, hospital.lon]} icon={hospitalIcon}>
                    <Popup>
                      <FaHospitalAlt className="text-red-500 inline mr-2" />
                      <span className="font-bold">{hospital.name}</span>
                      <br />
                      <GiPathDistance className="inline mr-2 text-gray-600" />
                      Distance: {distance.toFixed(2)} km
                      <br />
                      <FaAmbulance className="inline mr-2 text-blue-500" />
                      Estimated Time: {time} minutes
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}
          {showHospitals && route.length > 0 && (
            <Polyline positions={route} color="blue" weight={4} opacity={0.7} />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default SampleMap;
