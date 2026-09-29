import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";
import { Activity, Leaf, AlertTriangle, CheckCircle, TrendingUp, BarChart2 } from "lucide-react";

const COLORS = ["#16a34a", "#dc2626", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"];

export default function Analytics() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("detectionHistory") || "[]");
    setHistory(stored);
  }, []);

  // --- Computed Stats ---
  const totalScans   = history.length;
  const healthyCount = history.filter(h => h.is_healthy).length;
  const diseasedCount= totalScans - healthyCount;
  const avgConfidence= totalScans > 0
    ? Math.round(history.reduce((s, h) => s + (h.confidence || 0), 0) / totalScans * 100)
    : 0;

  // Pie chart data
  const pieData = [
    { name: "Healthy",  value: healthyCount  },
    { name: "Diseased", value: diseasedCount },
  ].filter(d => d.value > 0);

  // Bar chart — top diseases
  const diseaseCount = {};
  history.filter(h => !h.is_healthy).forEach(h => {
    const name = h.disease_name || "Unknown";
    diseaseCount[name] = (diseaseCount[name] || 0) + 1;
  });
  const barData = Object.entries(diseaseCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name: name.length > 18 ? name.slice(0, 18) + "…" : name, count }));

  // Line chart — scans per day
  const dayCount = {};
  history.forEach(h => {
    const day = h.timestamp ? new Date(h.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "Unknown";
    dayCount[day] = (dayCount[day] || 0) + 1;
  });
  const lineData = Object.entries(dayCount)
    .slice(-7)
    .map(([date, scans]) => ({ date, scans }));

  // Plant breakdown
  const plantCount = {};
  history.forEach(h => {
    const plant = h.plant_name || "Unknown";
    plantCount[plant] = (plantCount[plant] || 0) + 1;
  });
  const plantData = Object.entries(plantCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="text-center bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg text-white">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-1 flex items-center justify-center gap-2">
          <BarChart2 size={28} className="text-green-400" />
          Detection Analytics Dashboard
        </h1>
        <p className="text-gray-300 text-sm">Visual insights from your leaf disease scan history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Scans",      value: totalScans,    icon: <Activity size={20}/>,      color: "text-blue-700",   bg: "bg-blue-100/80 border border-blue-300" },
          { label: "Diseased Leaves",  value: diseasedCount, icon: <AlertTriangle size={20}/>, color: "text-rose-700",   bg: "bg-rose-100/80 border border-rose-300" },
          { label: "Healthy Leaves",   value: healthyCount,  icon: <CheckCircle size={20}/>,   color: "text-emerald-700",bg: "bg-emerald-100/80 border border-emerald-300" },
          { label: "Avg Confidence",   value: `${avgConfidence}%`, icon: <TrendingUp size={20}/>, color: "text-purple-700", bg: "bg-purple-100/80 border border-purple-300" },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className="card flex items-center gap-4 shadow-lg bg-emerald-50/85 border-emerald-200/60">
            <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0 shadow-sm`}>
              {icon}
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold">{label}</p>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {totalScans === 0 ? (
        /* Empty State */
        <div className="card text-center py-16 shadow-lg bg-emerald-50/85 border-emerald-200/60">
          <Leaf size={48} className="text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No scan data yet!</h3>
          <p className="text-sm text-gray-500">Go to <strong>Detect</strong> page, upload a leaf photo and come back to see your analytics.</p>
        </div>
      ) : (
        <>
          {/* Row 1 — Pie + Line */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Pie Chart */}
            <div className="card shadow-lg bg-emerald-50/85 border-emerald-200/60">
              <h2 className="font-bold text-gray-800 mb-4 text-base">🥧 Healthy vs Diseased Ratio</h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={i === 0 ? "#16a34a" : "#dc2626"} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} scans`]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="card shadow-lg bg-emerald-50/85 border-emerald-200/60">
              <h2 className="font-bold text-gray-800 mb-4 text-base">📅 Daily Scan Activity (Last 7 Days)</h2>
              {lineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#475569" }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#475569" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="scans" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: "#16a34a", r: 4 }} name="Scans" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500 text-sm">Not enough data yet</div>
              )}
            </div>
          </div>

          {/* Row 2 — Bar Charts */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Top Diseases */}
            <div className="card shadow-lg bg-emerald-50/85 border-emerald-200/60">
              <h2 className="font-bold text-gray-800 mb-4 text-base">🦠 Top Diseases Detected</h2>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#475569" }} />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: "#334155" }} />
                    <Tooltip />
                    <Bar dataKey="count" name="Cases" radius={[0,4,4,0]}>
                      {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500 text-sm">No disease data yet</div>
              )}
            </div>

            {/* Plant Breakdown */}
            <div className="card shadow-lg bg-emerald-50/85 border-emerald-200/60">
              <h2 className="font-bold text-gray-800 mb-4 text-base">🌿 Plant Species Scanned</h2>
              {plantData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={plantData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#334155" }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#475569" }} />
                    <Tooltip />
                    <Bar dataKey="count" name="Scans" radius={[4,4,0,0]}>
                      {plantData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500 text-sm">No plant data yet</div>
              )}
            </div>
          </div>

          {/* Recent Scans Table */}
          <div className="card shadow-lg overflow-x-auto bg-emerald-50/85 border-emerald-200/60">
            <h2 className="font-bold text-gray-800 mb-4 text-base">📋 Recent Scans (Latest 5)</h2>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-emerald-200 text-emerald-800 text-xs uppercase font-bold">
                  <th className="pb-2.5 pr-4">Plant</th>
                  <th className="pb-2.5 pr-4">Disease</th>
                  <th className="pb-2.5 pr-4">Status</th>
                  <th className="pb-2.5 pr-4">Confidence</th>
                  <th className="pb-2.5">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 5).map((h, i) => (
                  <tr key={i} className="border-b border-emerald-100 hover:bg-emerald-100/40 transition-colors">
                    <td className="py-2.5 pr-4 font-bold text-gray-900">{h.plant_name || "—"}</td>
                    <td className="py-2.5 pr-4 text-gray-700 font-medium">{h.disease_name || "—"}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${h.is_healthy ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
                        {h.is_healthy ? "Healthy" : "Diseased"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-emerald-800 font-bold">{Math.round((h.confidence || 0) * 100)}%</td>
                    <td className="py-2.5 text-gray-500 text-xs">
                      {h.timestamp ? new Date(h.timestamp).toLocaleDateString("en-IN") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Model Benchmark Comparison (CNN vs MobileNetV2) */}
          <div className="card shadow-lg bg-emerald-50/90 border border-emerald-300/70 p-6 rounded-2xl text-gray-900 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
              <h2 className="font-extrabold text-gray-900 text-base sm:text-lg flex items-center gap-2">
                <BarChart2 size={20} className="text-emerald-700" />
                Comparative Model Benchmark: Custom CNN vs. MobileNetV2
              </h2>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full">
                Active: MobileNetV2
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Comparison between our baseline <strong>Custom CNN</strong> (trained from scratch) and fine-tuned <strong>MobileNetV2</strong> on the PlantVillage dataset (54,309 images):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Custom CNN card */}
              <div className="bg-white/80 p-4 rounded-xl border border-red-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-900 text-sm">Baseline Custom CNN</span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">Trained from Scratch</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-gray-700 mb-1">
                      <span>Validation Accuracy</span>
                      <span className="font-bold text-red-800">86.4%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "86.4%" }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500 text-[10px]">Parameters</p>
                      <p className="font-bold text-gray-800">12.8 M</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500 text-[10px]">Model Size</p>
                      <p className="font-bold text-gray-800">72 MB</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500 text-[10px]">Latency</p>
                      <p className="font-bold text-gray-800">3.2 sec</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MobileNetV2 card */}
              <div className="bg-white/80 p-4 rounded-xl border-2 border-emerald-500 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-emerald-950 text-sm">MobileNetV2 ⭐</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Transfer Learning (ImageNet)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-gray-700 mb-1">
                      <span>Validation Accuracy</span>
                      <span className="font-extrabold text-emerald-700">96.8% (+10.4%)</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "96.8%" }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
                      <p className="text-gray-500 text-[10px]">Parameters</p>
                      <p className="font-bold text-emerald-800">3.4 M (-73%)</p>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
                      <p className="text-gray-500 text-[10px]">Model Size</p>
                      <p className="font-bold text-emerald-800">14 MB (5x Less)</p>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
                      <p className="text-gray-500 text-[10px]">Latency</p>
                      <p className="font-bold text-emerald-800">&lt; 1.2 sec</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
