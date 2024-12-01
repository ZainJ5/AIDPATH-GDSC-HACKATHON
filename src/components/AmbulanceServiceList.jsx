import React, { useState, useEffect } from 'react';
import { FaAmbulance } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import data from '../services.json';

const AmbulanceServicesList = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [timer, setTimer] = useState(null);

  const showBookingToast = (service) => {
    toast.success(
      <div className="flex flex-col gap-1">
        <p className="font-medium">Ambulance Booked Successfully!</p>
        <p className="text-sm">ETA: {service.time} minutes</p>
        <p className="text-xs text-gray-500">You can ask our AI Chatbot for first aid guidance</p>
      </div>,
      {
        duration: 5000,
        icon: '🚑',
        style: {
          background: '#f0fdf4',
          border: '1px solid #86efac',
        },
      }
    );
  };

  const showTimerToast = (remainingTime) => {
    toast.custom(
      (t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  🚑 Ambulance ETA: {formatTime(remainingTime)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Need first aid help? Click to open AI Chatbot
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 4000,
        position: 'top-right',
      }
    );
  };

  const showArrivalToast = () => {
    toast.success(
      <div className="flex flex-col gap-1">
        <p className="font-medium">Ambulance Has Arrived!</p>
        <p className="text-sm">Please be ready</p>
      </div>,
      {
        duration: 6000,
        icon: '🚑',
        style: {
          background: '#f0fdf4',
          border: '1px solid #86efac',
        },
      }
    );
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    setTimer(service.time * 60);
    showBookingToast(service);
  };

  useEffect(() => {
    setServices(data);
  }, []);

  useEffect(() => {
    if (timer !== null && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          if (newTime % 60 === 0) { 
            showTimerToast(newTime);
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0) {
      showArrivalToast();
    }
  }, [timer]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          duration: 5000,
          style: {
            background: '#fff',
            color: '#363636',
          },
        }}
      />
      
      {timer === null ? (
        // Show services list when no service is selected
        services.length > 0 && (
          <div className="space-y-6">
            {services.map((serviceType, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">
                  {serviceType.type.toUpperCase()}
                </h3>
                <div className="space-y-4">
                  {serviceType.services.map((service, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          {service.name} - <span className="text-gray-600">{service.owner}</span>
                        </p>
                        <p className="text-sm text-gray-500">Time: {service.time} minutes</p>
                      </div>
                      <button
                        onClick={() => handleBookService(service)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                      >
                        <FaAmbulance />
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // Show timer when service is selected
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
          <div className="text-center space-y-4">
            <FaAmbulance className="mx-auto text-5xl text-green-500" />
            <h2 className="text-2xl font-bold text-gray-800">Ambulance En Route</h2>
            <div className="text-4xl font-bold text-green-600">
              {formatTime(timer)}
            </div>
            <p className="text-gray-500">Until arrival</p>
            <button
              onClick={() => {
                setTimer(null);
                setSelectedService(null);
              }}
              className="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
            >
              Book Another Service
            </button>
            <h3 className="text-sm font-medium text-gray-500 mt-4">
                  Use Chatbot for instant first aid help
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbulanceServicesList;
