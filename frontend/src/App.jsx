import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import Home from "./pages/Home";
import Detect from "./pages/Detect";
import History from "./pages/History";
import About from "./pages/About";
import Analytics from "./pages/Analytics";
import Admin from "./pages/Admin";

function App() {
  const [visitorCount, setVisitorCount] = useState(1450);

  useEffect(() => {
    // Live visitor counter logic
    const current = parseInt(localStorage.getItem("total_site_visits") || "1450", 10);
    const sessionVisited = sessionStorage.getItem("site_session_tracked");
    let updated = current;
    if (!sessionVisited) {
      updated = current + 1;
      localStorage.setItem("total_site_visits", updated.toString());
      sessionStorage.setItem("site_session_tracked", "true");
    }
    setVisitorCount(updated);
  }, []);

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
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <footer className="bg-black/60 backdrop-blur-md border-t border-white/10 py-5 text-center text-sm text-gray-300 space-y-2">
          <p>
            🌿 AI BASED LEAF DISEASE DETECTION SYSTEM |{" "}
            <span className="text-primary-400 font-medium">PlantVillage Dataset</span>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10 text-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Site Visits: {visitorCount.toLocaleString()}
            </span>
            <Link to="/admin" className="hover:text-emerald-300 text-gray-400 transition-colors underline underline-offset-4 flex items-center gap-1">
              🔐 Admin Portal
            </Link>
          </div>
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
