import React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const severityConfig = {
  healthy:  { label: "Healthy",  color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200", icon: <CheckCircle className="text-green-500" size={24} /> },
  low:      { label: "Low Risk", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200",icon: <AlertTriangle className="text-yellow-500" size={24} /> },
  moderate: { label: "Moderate Risk", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200",icon: <AlertTriangle className="text-orange-500" size={24} /> },
  high:     { label: "High Risk", color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",   icon: <AlertTriangle className="text-red-500"    size={24} /> },
};

export default function ResultCard({ result }) {
  if (!result) return null;

  const severity = result.is_healthy ? "healthy" : result.severity || "moderate";
  const cfg = severityConfig[severity] || severityConfig.moderate;
  const confidencePct = Math.round(result.confidence * 100);

  const radialData = [{ name: "confidence", value: confidencePct, fill: result.is_healthy ? "#22c55e" : "#f97316" }];

  return (
    <div className={`card border ${cfg.border} space-y-5 shadow-lg`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 rounded-xl ${cfg.bg}`}>
        <div className="flex items-center gap-3">
          {cfg.icon}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Detected Plant / Leaf</p>
            <h2 className="text-2xl font-extrabold text-gray-800">{result.plant_name} Leaf</h2>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${cfg.color} ${cfg.bg} border ${cfg.border}`}>
          {cfg.label}
        </div>
      </div>

      {/* Disease Diagnosis */}
      <div className="bg-emerald-100/70 p-4 rounded-xl border border-emerald-300">
        <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Diagnosed Condition / Disease</p>
        <p className="text-xl font-black text-gray-900 mt-1">{result.disease_name}</p>
        {result.scientific_name && (
          <p className="text-xs text-gray-600 italic mt-0.5">Scientific Name: {result.scientific_name}</p>
        )}
      </div>

      {/* Confidence Gauge */}
      <div className="flex items-center gap-6 p-4 bg-emerald-100/70 rounded-xl border border-emerald-300">
        <div className="w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%" cy="50%" innerRadius="60%" outerRadius="100%"
              startAngle={90} endAngle={-270} data={radialData}
            >
              <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "#e2e8f0" }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Detection Accuracy / Confidence</p>
          <p className="text-4xl font-black text-gray-900">{confidencePct}<span className="text-lg font-normal text-emerald-700">%</span></p>
          <p className="text-xs text-gray-600">
            Status: <span className="font-bold text-emerald-800">{result.is_healthy ? "Healthy Plant" : "Diseased / Infected"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
