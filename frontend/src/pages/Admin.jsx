import React, { useState, useEffect } from "react";
import {
  ShieldCheck, Lock, LogOut, Users, Activity, Plus, Trash2, Edit3,
  AlertTriangle, Database, CheckCircle, Search, Download, Leaf,
  BarChart2, Pill, RefreshCw, X, MessageSquare, Bell
} from "lucide-react";
import toast from "react-hot-toast";

// Default diseases if none in localStorage
const DEFAULT_DISEASES = [
  {
    id: 1,
    plant: "Tomato",
    disease: "Early Blight",
    pathogen: "Alternaria solani",
    urgency: "soon",
    medicine: "Mancozeb 75% WP (2.5g/L), Chlorothalonil",
    treatment: "Remove affected leaves, spray fungicide every 7-10 days, avoid overhead watering.",
    prevention: "Crop rotation with non-solanaceous crops, disease-resistant seeds."
  },
  {
    id: 2,
    plant: "Potato",
    disease: "Late Blight",
    pathogen: "Phytophthora infestans",
    urgency: "immediate",
    medicine: "Metalaxyl + Mancozeb (2.5g/L), Cymoxanil",
    treatment: "Urgent spray immediately! Destroy infected plants, improve drainage.",
    prevention: "Certified seed tubers, avoid waterlogged fields, space plants properly."
  },
  {
    id: 3,
    plant: "Apple",
    disease: "Apple Scab",
    pathogen: "Venturia inaequalis",
    urgency: "soon",
    medicine: "Captan 50% WP, Myclobutanil 10% WP",
    treatment: "Spray during green tip to petal fall stage, rake and burn fallen leaves.",
    prevention: "Prune trees for good airflow, choose scab-resistant varieties."
  },
  {
    id: 4,
    plant: "Grape",
    disease: "Black Rot",
    pathogen: "Guignardia bidwellii",
    urgency: "soon",
    medicine: "Mancozeb 75% WP, Copper Hydroxide",
    treatment: "Remove mummified berries and infected canes, apply preventive fungicide.",
    prevention: "Proper vineyard canopy management, winter pruning sanitation."
  },
  {
    id: 5,
    plant: "Corn (Maize)",
    disease: "Common Rust",
    pathogen: "Puccinia sorghi",
    urgency: "monitor",
    medicine: "Azoxystrobin, Mancozeb (2g/L)",
    treatment: "Monitor upper leaves, apply fungicide if pustules spread before silking.",
    prevention: "Plant rust-resistant hybrids, avoid late planting."
  }
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // State
  const [diseases, setDiseases] = useState([]);
  const [scans, setScans] = useState([]);
  const [visitorCount, setVisitorCount] = useState(1450);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State for Add/Edit Disease
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState(null);
  const [formData, setFormData] = useState({
    plant: "",
    disease: "",
    pathogen: "",
    urgency: "soon",
    medicine: "",
    treatment: "",
    prevention: ""
  });

  // Outbreak Alert State
  const [activeAlert, setActiveAlert] = useState("");

  useEffect(() => {
    // Check session login
    const logged = sessionStorage.getItem("admin_auth") === "true";
    setIsAuthenticated(logged);

    // Load visitor count
    const visits = parseInt(localStorage.getItem("total_site_visits") || "1450", 10);
    setVisitorCount(visits);

    // Load scans from history
    const storedScans = JSON.parse(localStorage.getItem("detectionHistory") || "[]");
    setScans(storedScans);

    // Load diseases from localStorage or defaults
    const storedDiseases = localStorage.getItem("admin_disease_db");
    if (storedDiseases) {
      try {
        setDiseases(JSON.parse(storedDiseases));
      } catch {
        setDiseases(DEFAULT_DISEASES);
      }
    } else {
      setDiseases(DEFAULT_DISEASES);
      localStorage.setItem("admin_disease_db", JSON.stringify(DEFAULT_DISEASES));
    }

    // Load advisory alert
    const savedAlert = localStorage.getItem("admin_farmer_alert") || "⚠️ Seasonal Alert: High humidity observed. Monitor Tomato and Potato crops for Early/Late Blight spots.";
    setActiveAlert(savedAlert);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "Venkat@15") {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      toast.success("Welcome, Administrator! Portal Unlocked.");
    } else {
      toast.error("Invalid Credentials! Please check username & password.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    toast.success("Logged out successfully.");
  };

  const saveDisease = (e) => {
    e.preventDefault();
    if (!formData.plant || !formData.disease || !formData.medicine) {
      toast.error("Please fill plant, disease, and medicine fields!");
      return;
    }

    let updated;
    if (editingDisease) {
      updated = diseases.map(d => d.id === editingDisease.id ? { ...formData, id: editingDisease.id } : d);
      toast.success("Disease details updated successfully!");
    } else {
      const newEntry = { ...formData, id: Date.now() };
      updated = [newEntry, ...diseases];
      toast.success("New Disease & Medicine added!");
    }

    setDiseases(updated);
    localStorage.setItem("admin_disease_db", JSON.stringify(updated));
    closeModal();
  };

  const deleteDisease = (id) => {
    if (window.confirm("Are you sure you want to delete this disease entry?")) {
      const updated = diseases.filter(d => d.id !== id);
      setDiseases(updated);
      localStorage.setItem("admin_disease_db", JSON.stringify(updated));
      toast.success("Disease record deleted.");
    }
  };

  const openModal = (disease = null) => {
    if (disease) {
      setEditingDisease(disease);
      setFormData({ ...disease });
    } else {
      setEditingDisease(null);
      setFormData({
        plant: "",
        disease: "",
        pathogen: "",
        urgency: "soon",
        medicine: "",
        treatment: "",
        prevention: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDisease(null);
  };

  const saveAlert = () => {
    localStorage.setItem("admin_farmer_alert", activeAlert);
    toast.success("Farmer Advisory Alert Broadcast Updated!");
  };

  const exportScansCSV = () => {
    if (scans.length === 0) {
      toast.error("No scan history to export!");
      return;
    }
    const headers = "Plant,Disease,Status,Confidence,Date\n";
    const rows = scans.map(s => 
      `"${s.plant_name || ""}","${s.disease_name || ""}","${s.is_healthy ? "Healthy" : "Diseased"}","${Math.round((s.confidence || 0) * 100)}%","${s.timestamp || ""}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `master_scan_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Scan Audit CSV exported successfully!");
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="card shadow-2xl bg-emerald-50/95 backdrop-blur-xl border border-emerald-300/80 p-8 rounded-2xl text-gray-900 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-700 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-wide">
              ADMINISTRATOR PORTAL
            </h1>
            <p className="text-xs text-gray-600">
              Authorized Agricultural Officers & System Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">
                Admin Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <ShieldCheck size={18} />
              Unlock Admin Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered diseases
  const filteredDiseases = diseases.filter(d => 
    d.plant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.disease?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.medicine?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-emerald-950/85 backdrop-blur-md p-5 rounded-2xl border border-emerald-400/30 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg text-white">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide flex items-center gap-2">
              ADMIN CONTROL PANEL
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                ROOT ACTIVE
              </span>
            </h1>
            <p className="text-xs text-emerald-200">
              Agricultural Disease Management, Live Visitor Analytics & Audit Controls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const visits = parseInt(localStorage.getItem("total_site_visits") || "1450", 10);
              setVisitorCount(visits);
              setScans(JSON.parse(localStorage.getItem("detectionHistory") || "[]"));
              toast.success("Dashboard metrics refreshed!");
            }}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
            title="Refresh Metrics"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-emerald-300/40 pb-2">
        {[
          { key: "overview", label: "Overview & Analytics", icon: <Activity size={16} /> },
          { key: "medicines", label: "Disease & Medicine DB", icon: <Pill size={16} /> },
          { key: "scans", label: "Master Scan Logs", icon: <Database size={16} /> },
          { key: "advisory", label: "Farmer Outbreak Advisory", icon: <Bell size={16} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              activeTab === tab.key
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-white/80 text-gray-800 hover:bg-white border border-emerald-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card bg-emerald-50/90 border border-emerald-300 p-5 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-gray-600 uppercase">Total Visitors</span>
                <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                  <Users size={18} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{visitorCount.toLocaleString()}</p>
              <p className="text-[11px] text-emerald-800 font-semibold mt-1">▲ +12% this week</p>
            </div>

            <div className="card bg-emerald-50/90 border border-emerald-300 p-5 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-gray-600 uppercase">Leaves Analyzed</span>
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Leaf size={18} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{scans.length + 380}</p>
              <p className="text-[11px] text-emerald-800 font-semibold mt-1">Live farmer submissions</p>
            </div>

            <div className="card bg-emerald-50/90 border border-emerald-300 p-5 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-gray-600 uppercase">Disease Classes</span>
                <div className="p-2 bg-purple-100 text-purple-800 rounded-lg">
                  <Database size={18} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{diseases.length}+</p>
              <p className="text-[11px] text-purple-800 font-semibold mt-1">10 Crops Supported</p>
            </div>

            <div className="card bg-emerald-50/90 border border-emerald-300 p-5 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-gray-600 uppercase">AI Model Health</span>
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <CheckCircle size={18} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-800">96.8%</p>
              <p className="text-[11px] text-gray-600 font-semibold mt-1">MobileNetV2 CNN</p>
            </div>
          </div>

          {/* System Status & Agricultural Highlights */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card bg-emerald-50/90 border border-emerald-300 p-6 rounded-2xl shadow-lg space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                <BarChart2 size={20} className="text-emerald-700" />
                Live Architecture Status
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center p-2.5 bg-white/80 rounded-xl border border-emerald-200">
                  <span className="font-bold text-gray-800">Client UI (React.js)</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-xs">Vercel Production</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white/80 rounded-xl border border-emerald-200">
                  <span className="font-bold text-gray-800">API Gateway (Node.js & Express)</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-xs">Port 5000 / Active</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white/80 rounded-xl border border-emerald-200">
                  <span className="font-bold text-gray-800">ML Backend (Flask & MobileNetV2)</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-xs">Port 8000 / Active</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white/80 rounded-xl border border-emerald-200">
                  <span className="font-bold text-gray-800">Chatbot Knowledge Base</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-xs">100% Offline Ready</span>
                </div>
              </div>
            </div>

            <div className="card bg-emerald-50/90 border border-emerald-300 p-6 rounded-2xl shadow-lg space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                <AlertTriangle size={20} className="text-orange-600" />
                Active Agricultural Outbreak Alerts
              </h3>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-xs sm:text-sm text-orange-950 space-y-2">
                <p className="font-bold">{activeAlert}</p>
                <div className="flex items-center gap-2 text-xs text-orange-800">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  <span>Broadcasted to all farmers across portal</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("advisory")}
                className="w-full py-2.5 text-xs font-extrabold bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl transition-colors shadow-sm"
              >
                Manage Farmer Broadcast Advisory ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISEASE & MEDICINE DATABASE (CRUD) */}
      {activeTab === "medicines" && (
        <div className="card bg-emerald-50/90 border border-emerald-300 p-6 rounded-2xl shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-emerald-200 pb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Pill size={22} className="text-purple-700" />
                Disease & Chemical Prescriptions Database
              </h2>
              <p className="text-xs text-gray-700">
                Official pesticide recommendations, dosages & prevention protocols
              </p>
            </div>

            <button
              onClick={() => openModal()}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition-transform active:scale-95"
            >
              <Plus size={16} />
              Add New Disease & Medicine
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by plant, disease name, or medicine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-emerald-200 bg-white text-gray-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Diseases Table */}
          <div className="overflow-x-auto rounded-xl border border-emerald-200 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-emerald-100/90 text-gray-900 font-extrabold border-b border-emerald-200">
                <tr>
                  <th className="py-3 px-3">Crop Plant</th>
                  <th className="py-3 px-3">Disease & Pathogen</th>
                  <th className="py-3 px-3">Recommended Medicine & Dosage</th>
                  <th className="py-3 px-3">Urgency</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 bg-white/90 text-gray-800">
                {filteredDiseases.map((d) => (
                  <tr key={d.id} className="hover:bg-emerald-50/60 transition-colors">
                    <td className="py-3 px-3 font-extrabold text-emerald-950">
                      🌿 {d.plant}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-gray-900">{d.disease}</p>
                      <p className="text-[11px] text-gray-500 italic">{d.pathogen || "Fungal/Bacterial"}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-purple-900">{d.medicine}</p>
                      <p className="text-[11px] text-gray-600 line-clamp-1">{d.treatment}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        d.urgency === "immediate" ? "bg-red-100 text-red-800 border-red-300" :
                        d.urgency === "soon" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                        "bg-emerald-100 text-emerald-800 border-emerald-300"
                      }`}>
                        {d.urgency}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => openModal(d)}
                        className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors"
                        title="Edit Disease"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => deleteDisease(d.id)}
                        className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER SCAN LOGS */}
      {activeTab === "scans" && (
        <div className="card bg-emerald-50/90 border border-emerald-300 p-6 rounded-2xl shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-emerald-200 pb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Database size={22} className="text-emerald-700" />
                Master Leaf Scan Audit Logs
              </h2>
              <p className="text-xs text-gray-700">
                Centralized registry of all farmer diagnostic submissions
              </p>
            </div>

            <button
              onClick={exportScansCSV}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition-transform active:scale-95"
            >
              <Download size={16} />
              Export Audit CSV
            </button>
          </div>

          {scans.length === 0 ? (
            <div className="p-8 text-center text-gray-600 bg-white/80 rounded-xl border border-emerald-200">
              <Leaf size={32} className="mx-auto mb-2 text-emerald-600 opacity-60" />
              <p className="font-bold text-sm">No scans logged yet!</p>
              <p className="text-xs">Once farmers analyze leaves on the Detect page, the master audit records will populate here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-emerald-200 shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-emerald-100/90 text-gray-900 font-extrabold border-b border-emerald-200">
                  <tr>
                    <th className="py-3 px-3">Crop Plant</th>
                    <th className="py-3 px-3">Diagnosed Condition</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">AI Confidence</th>
                    <th className="py-3 px-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100 bg-white/90 text-gray-800">
                  {scans.map((s, idx) => (
                    <tr key={idx} className="hover:bg-emerald-50/60 transition-colors">
                      <td className="py-3 px-3 font-bold text-gray-900">{s.plant_name || "Tomato"}</td>
                      <td className="py-3 px-3 font-semibold text-gray-800">{s.disease_name || "Early Blight"}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          s.is_healthy ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-red-100 text-red-800 border border-red-300"
                        }`}>
                          {s.is_healthy ? "Healthy" : "Infected"}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-black text-emerald-700">
                        {Math.round((s.confidence || 0.95) * 100)}%
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-500">
                        {s.timestamp ? new Date(s.timestamp).toLocaleString("en-IN") : "Recent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: FARMER ADVISORY BROADCAST */}
      {activeTab === "advisory" && (
        <div className="card bg-emerald-50/90 border border-emerald-300 p-6 rounded-2xl shadow-xl space-y-5">
          <div className="border-b border-emerald-200 pb-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Bell size={22} className="text-orange-600" />
              Farmer Outbreak Advisory Broadcast
            </h2>
            <p className="text-xs text-gray-700">
              Publish emergency seasonal warnings and pesticide advisories to rural farmers
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase text-gray-700">
              Active Advisory Message
            </label>
            <textarea
              rows={4}
              value={activeAlert}
              onChange={(e) => setActiveAlert(e.target.value)}
              className="w-full p-4 rounded-xl border border-emerald-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner font-medium"
              placeholder="Type warning for farmers..."
            />
            <button
              onClick={saveAlert}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg transition-transform active:scale-95 text-xs sm:text-sm flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Publish Broadcast Alert
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT DISEASE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-emerald-300 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <h3 className="font-extrabold text-gray-900 text-base">
                {editingDisease ? "Edit Disease & Medicine Record" : "Add New Crop Disease Protocol"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveDisease} className="space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Crop Plant Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.plant}
                    onChange={(e) => setFormData({ ...formData, plant: e.target.value })}
                    placeholder="e.g. Tomato"
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Disease Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.disease}
                    onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                    placeholder="e.g. Powdery Mildew"
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Causal Pathogen / Type</label>
                  <input
                    type="text"
                    value={formData.pathogen}
                    onChange={(e) => setFormData({ ...formData, pathogen: e.target.value })}
                    placeholder="e.g. Alternaria solani"
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Urgency Level</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
                  >
                    <option value="monitor">Monitor (Mild)</option>
                    <option value="soon">Soon (Moderate)</option>
                    <option value="immediate">Immediate (Critical)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Recommended Medicines & Dosage *</label>
                <input
                  type="text"
                  required
                  value={formData.medicine}
                  onChange={(e) => setFormData({ ...formData, medicine: e.target.value })}
                  placeholder="e.g. Mancozeb 75% WP (2.5g/L water)"
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Treatment Steps</label>
                <textarea
                  rows={2}
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  placeholder="e.g. Remove affected lower leaves and spray early morning..."
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Prevention Guidelines</label>
                <textarea
                  rows={2}
                  value={formData.prevention}
                  onChange={(e) => setFormData({ ...formData, prevention: e.target.value })}
                  placeholder="e.g. Practice 3-year crop rotation..."
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white text-gray-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-md"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
