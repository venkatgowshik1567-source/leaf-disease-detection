import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Zap, Shield, BarChart2, ArrowRight } from "lucide-react";

const features = [
  { icon: <Zap size={22} className="text-yellow-500" />,   title: "Instant Detection",   desc: "Upload a photo and get results in seconds using our deep learning model." },
  { icon: <Shield size={22} className="text-blue-500" />,  title: "50+ Disease Classes",  desc: "Recognizes diseases across tomato, potato, corn, apple, grape & more." },
  { icon: <BarChart2 size={22} className="text-purple-500"/>, title: "Confidence Scores", desc: "See AI confidence percentages and detailed diagnosis reports." },
  { icon: <Leaf size={22} className="text-green-500" />,   title: "Treatment Advice",    desc: "Get actionable prevention, medicine, and treatment recommendations instantly." },
];

export default function Home() {
  const alert = localStorage.getItem("admin_farmer_alert") || "⚠️ Seasonal Advisory: High humidity observed. Inspect Tomato and Potato crops for Early/Late Blight.";

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black/35 backdrop-blur-md border-b border-white/20 text-white shadow-xl">
        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center">
          {alert && (
            <div className="mb-4 inline-flex items-center gap-2 bg-amber-500/25 border border-amber-400/40 text-amber-200 px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
              <span>{alert}</span>
            </div>
          )}
          <br />
          <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/30 px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
            🌾 "Agriculture is the Backbone of Our Nation — Healthy Crops, Wealthy Life"
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            AI BASED LEAF DISEASE<br />
            <span className="text-green-300">DETECTION SYSTEM</span>
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload a photo of any plant leaf and our deep learning model will identify
            diseases with high accuracy — providing medicines, treatment, and PDF reports in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/detect"
              className="bg-white text-primary-700 hover:bg-green-50 font-bold py-3 px-8 rounded-xl
                         shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 justify-center"
            >
              🔍 Analyze a Leaf <ArrowRight size={18} />
            </Link>
            <Link
              to="/about"
              className="bg-white/10 hover:bg-white/20 border border-white/30 font-semibold py-3 px-8
                         rounded-xl transition-all duration-200 flex items-center gap-2 justify-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="card flex gap-4 hover:shadow-2xl hover:border-emerald-400 transition-all bg-emerald-50/85 border-emerald-200/60">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shadow-sm">{icon}</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-base">{title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-12 text-center pb-20">
        <div className="bg-gradient-to-r from-primary-600 to-green-500 rounded-3xl p-10 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-3">Ready to protect your crops?</h2>
          <p className="text-white/80 mb-6 text-sm">It only takes a few seconds to get a diagnosis, medicines, and treatment plan.</p>
          <Link to="/detect" className="bg-white text-primary-700 hover:bg-green-50 font-bold py-3 px-8 rounded-xl inline-flex items-center gap-2 shadow-lg">
            Start Free Analysis <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
