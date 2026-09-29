import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import Home from "./pages/Home";
import Detect from "./pages/Detect";
import History from "./pages/History";
import About from "./pages/About";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Router>
      <div 
        className="min-h-screen flex flex-col antialiased text-gray-900"
        style={{
          backgroundImage: `linear-gradient(rgba(5, 20, 10, 0.58), rgba(10, 18, 35, 0.65)), url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2069&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detect" element={<Detect />} />
            <Route path="/history" element={<History />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="bg-black/60 backdrop-blur-md border-t border-white/10 py-6 text-center text-sm text-gray-300">
          <p>
            🌿 AI BASED LEAF DISEASE DETECTION SYSTEM |{" "}
            <span className="text-primary-400 font-medium">PlantVillage Dataset</span>
          </p>
        </footer>
        <Toaster
          position="top-right"
          toastOptions={{
            success: { style: { background: "#f0fdf4", border: "1px solid #86efac", color: "#15803d" } },
            error:   { style: { background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c" } },
          }}
        />
        {/* Floating AI Chatbot */}
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;
