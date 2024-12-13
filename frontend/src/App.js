import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CarList from './components/CarList';
import ReservationForm from './components/ReservationForm';
import { AuthProvider } from './context/AuthContext';
import PricePage from './components/PricePage'; // Import PricePage
import Chatbot from './components/Chatbot';
import Navbar from './components/Navbar';
import './components/Chatbot.css';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false); // State to manage chatbot visibility

  const toggleChat = () => {
    setIsChatOpen((prevState) => !prevState); // Toggle chatbot visibility
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar/>
        <div>
          {/* Define routes for the app */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/cars"
              element={<CarList />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reserve/:carId" element={<ReservationForm />} />
            <Route path="/price" element={<PricePage />} /> {/* Ensure PricePage route is present */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
    
          </Routes>

          {/* Chatbot toggle button */}
          <button 
            className="chat-toggle-btn" 
            onClick={toggleChat}  // Toggle the chatbot visibility
          >
            Chat
          </button>

          {/* Chatbot component, visible only when isChatOpen is true */}
          {isChatOpen && <Chatbot />}
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
