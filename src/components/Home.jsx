import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import SampleMap from "./SampleMap";
import AmbulanceServicesList from "./AmbulanceServiceList";
import AIChatbot from "./AIChatbot";

const Home = () => {
  const [showServiceButton, setShowServiceButton] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [coordinates, setCoordinates] = useState([34.070, 72.643]);
  const [isLoading, setIsLoading] = useState(true); 

  const handleEmergencyClick = () => {
    setShowServiceButton(true);
  };

  const handleServiceButtonClick = () => {
    setShowServices(true);
  };


useEffect(() => {
  if ("geolocation" in navigator) {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates([latitude, longitude]);
        console.log("Coordinates updated:", [latitude, longitude]); 
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLoading(false);
      }
    );
  } else {
    console.log("Geolocation is not supported");
    setIsLoading(false);
  }
}, []); // Remove

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6 min-h-[600px]">
        <div className="md:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-[600px]">
            {!isLoading && (
              <SampleMap 
                center={coordinates} 
                zoom={14} 
                onEmergencyClick={handleEmergencyClick}
                showServiceButton={showServiceButton}
                onServiceButtonClick={handleServiceButtonClick}
                className="h-full w-full"
              />
            )}
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <p>Loading map...</p>
              </div>
            )}
          </div>
        </div>
        {showServices && (
          <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Ambulance Services</h2>
              <button 
                onClick={() => setShowServices(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <AmbulanceServicesList />
          </div>
        )}
      </div>
      
      <div className="fixed bottom-4 right-4 z-50">
        <AIChatbot />
      </div>
    </>
  );
};

export default Home;
