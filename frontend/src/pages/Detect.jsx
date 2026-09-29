import React, { useState } from "react";
import toast from "react-hot-toast";
import ImageUpload from "../components/ImageUpload";
import ResultCard  from "../components/ResultCard";
import DiseaseInfo from "../components/DiseaseInfo";
import { detectDisease } from "../services/api";
import { RotateCcw, Download } from "lucide-react";

export default function Detect() {
  const [result,    setResult]    = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleUpload = async (file) => {
    setIsLoading(true);
    setResult(null);
    setUploadedFile(file);
    try {
      const data = await detectDisease(file);
      setResult(data);
      toast.success("Leaf disease detection complete!");

      // Save to local history
      const history = JSON.parse(localStorage.getItem("detectionHistory") || "[]");
      history.unshift({ ...data, timestamp: new Date().toISOString(), imageUrl: URL.createObjectURL(file) });
      localStorage.setItem("detectionHistory", JSON.stringify(history.slice(0, 20)));
    } catch (err) {
      toast.error(err.message || "Detection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setUploadedFile(null);
  };

  const handleDownloadPDF = () => {
    if (!result) return;

    toast.loading("Generating PDF Report...", { id: "pdf-toast" });

    const formatList = (items) => {
      if (Array.isArray(items)) {
        return items.map((item) => `<li>${item}</li>`).join("");
      }
      return `<li>${items || "N/A"}</li>`;
    };

    const symptomsHtml = formatList(result.disease_info?.symptoms);
    const medicinesHtml = formatList(result.disease_info?.medicines);
    const treatmentHtml = formatList(result.disease_info?.treatment);
    const preventionHtml = formatList(result.disease_info?.prevention);

    // Create invisible container element for PDF rendering
    const reportContainer = document.createElement("div");
    reportContainer.style.padding = "20px";
    reportContainer.style.fontFamily = "Arial, sans-serif";
    reportContainer.style.color = "#1f2937";
    reportContainer.style.backgroundColor = "#ffffff";

    reportContainer.innerHTML = `
      <div style="text-align: center; border-bottom: 3px solid #16a34a; padding-bottom: 12px; margin-bottom: 20px;">
        <h1 style="color: #15803d; margin: 0; font-size: 22px;">🌿 AI BASED LEAF DISEASE DETECTION SYSTEM</h1>
        <p style="color: #4b5563; font-size: 12px; margin-top: 4px;">Official Diagnosis & Care Report | Generated: ${new Date().toLocaleString()}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px;">
          <h3 style="margin: 0; font-size: 11px; text-transform: uppercase; color: #6b7280;">Plant / Leaf Name</h3>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: bold; color: #111827;">${result.plant_name} Leaf</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px;">
          <h3 style="margin: 0; font-size: 11px; text-transform: uppercase; color: #6b7280;">Diagnosed Condition</h3>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: bold; color: #111827;">${result.disease_name}</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px;">
          <h3 style="margin: 0; font-size: 11px; text-transform: uppercase; color: #6b7280;">Health Status</h3>
          <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: bold; color: ${result.is_healthy ? '#16a34a' : '#dc2626'};">${result.is_healthy ? 'HEALTHY PLANT' : 'DISEASED / INFECTED'}</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px;">
          <h3 style="margin: 0; font-size: 11px; text-transform: uppercase; color: #6b7280;">AI Confidence Score</h3>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: bold; color: #111827;">${Math.round(result.confidence * 100)}%</p>
        </div>
      </div>

      ${result.scientific_name ? `<p style="font-size: 12px; color: #4b5563; margin-bottom: 15px;"><strong>Scientific Name:</strong> <em>${result.scientific_name}</em></p>` : ''}
      
      ${result.disease_info?.description ? `
        <div style="margin-bottom: 15px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px; background-color: #f9fafb;">
          <h2 style="font-size: 15px; color: #15803d; border-bottom: 2px solid #dcfce7; padding-bottom: 4px; margin-top: 0;">Overview & Description</h2>
          <p style="font-size: 13px; margin: 0;">${result.disease_info.description}</p>
        </div>
      ` : ''}

      <div style="margin-bottom: 15px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px;">
        <h2 style="font-size: 15px; color: #15803d; border-bottom: 2px solid #dcfce7; padding-bottom: 4px; margin-top: 0;">🔍 Identified Symptoms</h2>
        <ul style="margin: 6px 0; padding-left: 18px; font-size: 13px;">${symptomsHtml}</ul>
      </div>

      <div style="margin-bottom: 15px; border: 1px solid #e9d5ff; border-radius: 8px; padding: 12px 16px; background-color: #faf5ff;">
        <h2 style="font-size: 15px; color: #7e22ce; border-bottom: 2px solid #f3e8ff; padding-bottom: 4px; margin-top: 0;">💊 Medicines & Chemical Control to Cure</h2>
        <ul style="margin: 6px 0; padding-left: 18px; font-size: 13px;">${medicinesHtml}</ul>
      </div>

      <div style="margin-bottom: 15px; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px 16px; background-color: #eff6ff;">
        <h2 style="font-size: 15px; color: #1d4ed8; border-bottom: 2px solid #dbeafe; padding-bottom: 4px; margin-top: 0;">🛡️ Treatment & Application Steps</h2>
        <ul style="margin: 6px 0; padding-left: 18px; font-size: 13px;">${treatmentHtml}</ul>
      </div>

      <div style="margin-bottom: 15px; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; background-color: #f0fdf4;">
        <h2 style="font-size: 15px; color: #15803d; border-bottom: 2px solid #dcfce7; padding-bottom: 4px; margin-top: 0;">🌱 Prevention & Care Guidelines</h2>
        <ul style="margin: 6px 0; padding-left: 18px; font-size: 13px;">${preventionHtml}</ul>
      </div>

      <div style="text-align: center; font-size: 10px; color: #9ca3af; margin-top: 25px; border-top: 1px solid #e5e7eb; padding-top: 8px;">
        <p>AI Based Leaf Disease Detection System • Report ID: LG-${Date.now()}</p>
      </div>
    `;

    const fileName = `${result.plant_name}_${result.disease_name.replace(/\s+/g, '_')}_Report.pdf`;

    const opt = {
      margin:       10,
      filename:     fileName,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
      window.html2pdf().set(opt).from(reportContainer).save().then(() => {
        toast.success("PDF Report Downloaded Successfully!", { id: "pdf-toast" });
      }).catch((err) => {
        console.error("PDF Export error:", err);
        toast.error("PDF generation failed, opening print window fallback...", { id: "pdf-toast" });
        window.print();
      });
    } else {
      // Fallback
      toast.dismiss("pdf-toast");
      window.print();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-6 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">🌿 Plant Leaf Disease Detection &amp; Cure</h1>
        <p className="text-sm text-gray-200">Upload a leaf photo to get Diagnosis, Medicines, Treatment &amp; Downloadable PDF Report.</p>
      </div>

      {!result ? (
        /* Initial Upload View - 2 Columns */
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="card shadow-xl bg-emerald-50/90 border border-emerald-300">
            <div className="flex items-center justify-between mb-4 border-b border-emerald-200 pb-2">
              <h2 className="font-extrabold text-gray-900 text-lg">📸 Upload Leaf Photo</h2>
            </div>
            <ImageUpload onUpload={handleUpload} isLoading={isLoading} />
          </div>

          <div className="card bg-emerald-50/90 backdrop-blur-md border border-emerald-300 shadow-xl flex flex-col justify-between p-5">
            {/* Illustration / Demo Photo */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 border border-emerald-300/80 shadow-inner group">
              <img
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=600&auto=format&fit=crop"
                alt="Leaf Inspection Guide"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs font-bold text-emerald-200 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md border border-emerald-400/40">
                  🌱 Healthy vs Diseased Foliage
                </span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-black text-emerald-950 mb-3 flex items-center gap-2 border-b border-emerald-200 pb-2">
              📸 Tips for Accurate Detection
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-950 font-bold">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-black">•</span>
                <span>Focus on a single affected leaf</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-black">•</span>
                <span>Ensure proper daylight or clear lighting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-black">•</span>
                <span>Avoid extreme blur or dark shadows</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-black">•</span>
                <span>Works for Tomato, Potato, Apple, Corn, Grape, Pepper, etc.</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        /* Results View - Balanced Layout */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-950/80 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-emerald-500/30">
            <button onClick={handleReset} className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-xl border border-emerald-500/30 text-sm flex items-center gap-2 transition-all">
              <RotateCcw size={16} className="text-emerald-400" /> Scan Another Leaf
            </button>
            <button
              onClick={handleDownloadPDF}
              className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-lg text-white font-bold"
            >
              <Download size={16} /> Download PDF Report
            </button>
          </div>

          {/* Top Section: Uploaded Image & Result Summary Side by Side */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="card shadow-xl lg:col-span-1 flex flex-col justify-center">
              <h2 className="font-semibold text-gray-700 mb-3 text-sm">Scanned Leaf Photo</h2>
              <ImageUpload onUpload={handleUpload} isLoading={isLoading} />
            </div>

            <div className="lg:col-span-2">
              <ResultCard result={result} />
            </div>
          </div>

          {/* Bottom Section: Full Width 2-Column Grid Treatment & Medicine Plan */}
          {result.disease_info && (
            <DiseaseInfo info={result.disease_info} />
          )}
        </div>
      )}
    </div>
  );
}
