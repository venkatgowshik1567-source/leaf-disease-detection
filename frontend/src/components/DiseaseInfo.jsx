import React, { useState } from "react";
import { ChevronDown, ChevronUp, Leaf, Zap, Shield, BookOpen, Pill } from "lucide-react";

export default function DiseaseInfo({ info }) {
  const [expanded, setExpanded] = useState({
    symptoms: true,
    medicines: true,
    treatment: true,
    prevention: true
  });

  if (!info) return null;

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const sections = [
    {
      key: "symptoms",
      title: "Identified Symptoms",
      icon: <Zap size={18} className="text-orange-600" />,
      content: info.symptoms,
      headerBg: "bg-orange-100 hover:bg-orange-200/80",
      headerText: "text-orange-900",
      borderLeft: "border-l-4 border-orange-500",
      chevronColor: "text-orange-700",
    },
    {
      key: "medicines",
      title: "Medicines to Cure",
      icon: <Pill size={18} className="text-purple-700" />,
      content: info.medicines,
      headerBg: "bg-purple-100 hover:bg-purple-200/80",
      headerText: "text-purple-900",
      borderLeft: "border-l-4 border-purple-500",
      chevronColor: "text-purple-700",
    },
    {
      key: "treatment",
      title: "Treatment Steps",
      icon: <Shield size={18} className="text-blue-600" />,
      content: info.treatment,
      headerBg: "bg-blue-100 hover:bg-blue-200/80",
      headerText: "text-blue-900",
      borderLeft: "border-l-4 border-blue-500",
      chevronColor: "text-blue-700",
    },
    {
      key: "prevention",
      title: "Prevention Guidelines",
      icon: <Leaf size={18} className="text-emerald-700" />,
      content: info.prevention,
      headerBg: "bg-emerald-100 hover:bg-emerald-200/80",
      headerText: "text-emerald-900",
      borderLeft: "border-l-4 border-emerald-600",
      chevronColor: "text-emerald-700",
    },
  ];

  return (
    <div className="card space-y-4 shadow-xl p-6 rounded-2xl bg-emerald-50/90 border border-emerald-300/60">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-emerald-700" />
          <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">Diagnosis, Medicine &amp; Cure Plan</h3>
        </div>
        {info.urgency && (
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${info.urgency === "immediate" ? "bg-red-100 text-red-800 border border-red-300" :
              info.urgency === "soon"      ? "bg-yellow-100 text-yellow-800 border border-yellow-300" :
                                             "bg-emerald-100 text-emerald-800 border border-emerald-300"}`}>
            Urgency: {info.urgency}
          </div>
        )}
      </div>

      {info.description && (
        <p className="text-xs sm:text-sm text-gray-800 leading-relaxed border-l-4 border-emerald-600 pl-3 bg-emerald-100/60 py-2 rounded-r-lg font-medium">
          {info.description}
        </p>
      )}

      {/* Grid Layout - 2 Columns on Desktop */}
      <div className="grid md:grid-cols-2 gap-4 pt-1">
        {sections.map(({ key, title, icon, content, headerBg, headerText, borderLeft, chevronColor }) => (
          <div key={key} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full bg-white/80">
            <button
              onClick={() => toggle(key)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 transition-colors ${headerBg} ${borderLeft}`}
            >
              <div className={`flex items-center gap-2 font-extrabold text-xs sm:text-sm ${headerText}`}>
                {icon} {title}
              </div>
              {expanded[key] ? <ChevronUp size={16} className={chevronColor} /> : <ChevronDown size={16} className={chevronColor} />}
            </button>

            {expanded[key] && content && (
              <div className="p-3.5 bg-white/90 flex-1">
                {Array.isArray(content) ? (
                  <ul className="space-y-2 list-disc pl-4 text-xs sm:text-sm text-gray-800 font-medium">
                    {content.map((item, i) => (
                      <li key={i} className="leading-snug">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{content}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
