import React, { useState } from 'react';
import { Shield, DollarSign, Home, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      link: '/'
    },
    { 
      icon: Shield, 
      label: 'Insurance',
      link: '/insurance'
    },
    { 
      icon: DollarSign, 
      label: 'Loans',
      link: '/loans'
    }
  ];

  return (
    <nav className="bg-white shadow-sm relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield color="white" size={24} />
            </div>
            <span className="text-xl font-bold text-blue-800">AIDPATH</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.link}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-all duration-300 ease-in-out"
              >
                <item.icon size={20} className="mr-1" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
            
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 ease-in-out"
            >
              <User size={20} />
              <span className="text-sm font-medium">Profile</span>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div
          className={`
            md:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out transform
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="flex flex-col pt-20 px-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.link}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 ease-in-out py-2"
              >
                <item.icon size={20} />
                <span className="text-lg font-medium">{item.label}</span>
              </Link>
            ))}
            
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 ease-in-out py-2"
            >
              <User size={20} />
              <span className="text-lg font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;