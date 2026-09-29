import React from "react";
import { Globe, Cpu, Database, Server } from "lucide-react";

const techStack = [
  { layer: "Frontend",        tech: "React.js 18 + TailwindCSS",      icon: <Globe size={18} className="text-blue-500" /> },
  { layer: "API Gateway",     tech: "Node.js + Express",              icon: <Server size={18} className="text-green-500" /> },
  { layer: "ML Backend",      tech: "Python Flask + TensorFlow/Keras", icon: <Cpu size={18} className="text-purple-500" /> },
  { layer: "Training Data",   tech: "PlantVillage Dataset (54K imgs)", icon: <Database size={18} className="text-orange-500" /> },
];

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg text-white">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 uppercase tracking-wide">
          AI BASED LEAF DISEASE DETECTION SYSTEM
        </h1>
        <p className="text-gray-200 text-sm">An open-source deep learning system for plant disease diagnosis</p>
      </div>

      {/* Mission */}
      <div className="card shadow-lg">
        <h2 className="font-bold text-gray-800 text-xl mb-3">🌱 Our Mission</h2>
        <p className="text-gray-600 leading-relaxed text-sm">
          The AI Based Leaf Disease Detection System aims to democratize access to plant disease diagnosis for farmers and gardeners worldwide.
          By leveraging deep learning and computer vision, we can detect diseases early and provide actionable
          medicines, treatment recommendations, and downloadable PDF reports — reducing crop losses and pesticide overuse.
        </p>
      </div>

      {/* Tech Stack */}
      <div className="card shadow-lg">
        <h2 className="font-bold text-gray-800 text-xl mb-4">🛠 Technology Stack</h2>
        <div className="space-y-3">
          {techStack.map(({ layer, tech, icon }) => (
            <div key={layer} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center">{icon}</div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{layer}</p>
                <p className="text-sm font-medium text-gray-700">{tech}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Benchmark Comparison (CNN vs MobileNetV2) */}
      <div className="card shadow-xl p-6 rounded-2xl bg-emerald-50/90 border border-emerald-300/70 text-gray-950 space-y-5">
        <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
          <div className="flex items-center gap-2">
            <Cpu size={22} className="text-emerald-700" />
            <h2 className="font-extrabold text-gray-900 text-lg sm:text-xl">
              Model Benchmark: Custom CNN vs. MobileNetV2
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Selected: MobileNetV2
          </span>
        </div>

        <p className="text-gray-800 text-xs sm:text-sm leading-relaxed">
          During experimental development on the <strong>PlantVillage dataset</strong> (54,309 images), we trained both a baseline 
          <strong> Custom CNN architecture</strong> from scratch and a fine-tuned <strong>MobileNetV2</strong> model using Transfer Learning. 
          MobileNetV2 demonstrated significant superiority in accuracy, speed, and resource efficiency:
        </p>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-emerald-200 shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-emerald-100/90 text-gray-900 font-extrabold border-b border-emerald-200">
              <tr>
                <th className="py-2.5 px-3">Performance Metric</th>
                <th className="py-2.5 px-3 text-red-900 bg-red-50/50">Custom CNN (From Scratch)</th>
                <th className="py-2.5 px-3 text-emerald-950 bg-emerald-200/60 font-black">MobileNetV2 (Transfer Learning) ⭐</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100 bg-white/80 text-gray-800 font-medium">
              <tr>
                <td className="py-2.5 px-3 font-bold text-gray-900">Training Accuracy</td>
                <td className="py-2.5 px-3 text-gray-700">89.2%</td>
                <td className="py-2.5 px-3 font-extrabold text-emerald-700 bg-emerald-50/50">98.5% (+9.3%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-gray-900">Validation / Test Accuracy</td>
                <td className="py-2.5 px-3 text-gray-700">86.4%</td>
                <td className="py-2.5 px-3 font-extrabold text-emerald-700 bg-emerald-50/50">96.8% (+10.4%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-gray-900">Total Parameters</td>
                <td className="py-2.5 px-3 text-gray-700">~12.8 Million (Heavy)</td>
                <td className="py-2.5 px-3 font-extrabold text-emerald-700 bg-emerald-50/50">3.4 Million (73% Less)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-gray-900">Model File Size</td>
                <td className="py-2.5 px-3 text-gray-700">~72 MB</td>
                <td className="py-2.5 px-3 font-extrabold text-emerald-700 bg-emerald-50/50">~14 MB (5x Smaller)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-gray-900">Inference Latency</td>
                <td className="py-2.5 px-3 text-gray-700">~3.2 seconds</td>
                <td className="py-2.5 px-3 font-extrabold text-emerald-700 bg-emerald-50/50">&lt; 1.2 seconds (Real-time)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-gray-900">Overfitting Vulnerability</td>
                <td className="py-2.5 px-3 text-red-700 font-semibold">High (Requires massive data)</td>
                <td className="py-2.5 px-3 text-emerald-800 font-semibold bg-emerald-50/50">Extremely Low (ImageNet priors)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Why MobileNetV2 Won Key Points */}
        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-white/90 p-3.5 rounded-xl border border-emerald-200">
            <p className="font-extrabold text-emerald-900 text-xs sm:text-sm mb-1">1. Transfer Learning</p>
            <p className="text-gray-700 text-xs leading-relaxed">
              Pre-trained on 1.4M ImageNet photos. Retains edge, texture & leaf morphology knowledge.
            </p>
          </div>
          <div className="bg-white/90 p-3.5 rounded-xl border border-emerald-200">
            <p className="font-extrabold text-emerald-900 text-xs sm:text-sm mb-1">2. Depthwise Convolutions</p>
            <p className="text-gray-700 text-xs leading-relaxed">
              Separates spatial filtering from channel mixing, reducing computations by ~75%.
            </p>
          </div>
          <div className="bg-white/90 p-3.5 rounded-xl border border-emerald-200">
            <p className="font-extrabold text-emerald-900 text-xs sm:text-sm mb-1">3. Edge & Mobile Ready</p>
            <p className="text-gray-700 text-xs leading-relaxed">
              Small 14 MB footprint allows quick execution even on low-bandwidth rural farmer devices.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card bg-yellow-50 border-yellow-200 shadow-md">
        <h2 className="font-bold text-yellow-800 mb-2">⚠️ Disclaimer</h2>
        <p className="text-yellow-700 text-sm leading-relaxed">
          This tool is for educational and reference purposes only. For serious crop disease management,
          always consult a certified agronomist or plant pathologist. AI predictions may not be 100% accurate
          and should be verified with professional expertise.
        </p>
      </div>
    </div>
  );
}
