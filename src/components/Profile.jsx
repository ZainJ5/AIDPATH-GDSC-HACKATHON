// Profile.jsx
import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

const Profile = () => {
  const userProfile = {
    name: 'Dynamic Minds',
    email: 'dynamicMinds@gmail.com',
    phone: '+92 300 1234567',
    address: 'GIKI, Topi, Swabi'
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <User size={48} className="text-blue-600" />
            </div>
          </div>
          <h1 className="text-white text-center text-2xl font-bold mt-4">{userProfile.name}</h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <Mail className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800 font-medium">{userProfile.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Phone className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-800 font-medium">{userProfile.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <MapPin className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-gray-800 font-medium">{userProfile.address}</p>
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;