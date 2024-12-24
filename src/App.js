// src/App.js
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'; // Import Routes and Route
import Home from './Home'; // Import Home component
import Dashboard from './Dashboard'; // Import Dashboard component

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} /> {/* Home page route */}
      <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard page route */}
    </Routes>
    </BrowserRouter>
  );
}

export default App;
