import React from 'react';
import { FaWallet } from 'react-icons/fa';
import { RealTimestocks } from './Realtimestocks';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <FaWallet className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Portfolio Tracker</span>
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-blue-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold">Welcome to Portfolio Tracker</h1>
          <p className="mt-4 text-lg">
            Track your investments, monitor real-time stocks, and manage your portfolio with ease.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <h2 className="text-2xl font-bold mb-6">Real-Time Stocks</h2>

        {/* Highlighted Dashboard Button */}
        <button
          onClick={() => navigate('/dashboard')} // Navigates to the dashboard route
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
        >
          Dashboard
        </button>

        <RealTimestocks />
      </main>
    </div>
  );
}

export default Home;
