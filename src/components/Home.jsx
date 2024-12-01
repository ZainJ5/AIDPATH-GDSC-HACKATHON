import React, { useState } from "react";
import { X } from "lucide-react";
import SampleMap from "./SampleMap";
import AmbulanceServicesList from "./AmbulanceServiceList";
import AIChatbot from "./AIChatbot";

const Home = () => {
  const [showServiceButton, setShowServiceButton] = useState(false);
  const [showServices, setShowServices] = useState(false);

  const handleEmergencyClick = () => {
    setShowServiceButton(true);
  };

  const handleServiceButtonClick = () => {
    setShowServices(true);
  };

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative">
            <SampleMap 
              center={[34.068556, 72.640164]} 
              zoom={14} 
              onEmergencyClick={handleEmergencyClick}
              showServiceButton={showServiceButton}
              onServiceButtonClick={handleServiceButtonClick}
              className="h-full w-full"
            />
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