import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Loans from './components/Loans';
import Insurance from './components/Insurance';
import Home from './components/Home';  
import Profile from './components/Profile';  

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </header>

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/profile" element={<Profile />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;