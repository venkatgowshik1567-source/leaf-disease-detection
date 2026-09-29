import React, { useState, useEffect } from "react";
import { Clock, Trash2, CheckCircle, AlertTriangle, Search } from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("detectionHistory") || "[]");
    setHistory(stored);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("detectionHistory");
    setHistory([]);
  };

  const filtered = history.filter((h) =>
    h.disease_name?.toLowerCase().includes(search.toLowerCase()) ||
    h.plant_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6 bg-black/60 backdrop-blur-lg p-5 rounded-2xl border border-white/25 shadow-xl text-white">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">📋 Detection History</h1>
          <p className="text-emerald-300 text-sm mt-1 font-bold">{history.length} record{history.length !== 1 ? "s" : ""} stored locally</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory} 
            className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-sm py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg border border-red-500"
          >
            <Trash2 size={16} className="text-white" /> Clear All
          </button>
        )}
      </div>

      {/* Search */}
      {history.length > 0 && (
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by plant or disease name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/95 backdrop-blur-md border border-emerald-300 rounded-xl text-sm font-semibold text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card text-center py-16 text-gray-700 bg-emerald-50/90 border-emerald-300">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-bold text-lg text-gray-800">{history.length === 0 ? "No detections yet" : "No results match your search"}</p>
          <p className="text-sm mt-1 text-gray-600">Run a detection to see history here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((record, index) => (
            <div key={index} className="card flex items-center gap-4 hover:shadow-xl transition-all bg-emerald-50/90 border border-emerald-300/80 p-4">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-emerald-100 border border-emerald-300 shrink-0 flex items-center justify-center shadow-sm">
                {record.imageUrl ? (
                  <img src={record.imageUrl} alt="leaf" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🌿</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {record.is_healthy
                    ? <CheckCircle size={17} className="text-emerald-700 shrink-0" />
                    : <AlertTriangle size={17} className="text-amber-700 shrink-0" />}
                  <p className="font-extrabold text-gray-950 text-base truncate">{record.disease_name}</p>
                </div>
                <p className="text-sm text-gray-800 font-bold mt-0.5">
                  Plant: <span className="font-black text-emerald-900">{record.plant_name}</span>
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-600 font-semibold mt-1">
                  <Clock size={12} className="text-emerald-700" />
                  {record.timestamp ? new Date(record.timestamp).toLocaleString() : "Unknown time"}
                </div>
              </div>

              {/* Confidence */}
              <div className="shrink-0 text-right">
                <p className="text-2xl font-black text-gray-950">
                  {Math.round((record.confidence || 0) * 100)}<span className="text-sm font-bold text-gray-700">%</span>
                </p>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">confidence</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
