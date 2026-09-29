import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = { "image/*": [".jpg", ".jpeg", ".png", ".webp"] };

export default function ImageUpload({ onUpload, isLoading }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile]       = useState(null);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const err = rejectedFiles[0].errors[0];
        toast.error(err.code === "file-too-large" ? "File must be smaller than 10MB" : err.message);
        return;
      }
      const f = acceptedFiles[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    multiple: false,
  });

  const handleClear = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = () => {
    if (!file) { toast.error("Please select an image first"); return; }
    onUpload(file);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-300 group
          ${isDragActive ? "border-emerald-500 bg-emerald-100/70 dropzone-active" : "border-emerald-300/80 hover:border-emerald-500 bg-emerald-50/60 hover:bg-emerald-100/50"}
          ${preview ? "py-4" : "py-16"}`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Leaf preview"
              className="max-h-72 max-w-full rounded-xl object-contain shadow-md mx-auto"
            />
            <button
              onClick={handleClear}
              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white
                         rounded-full p-1 shadow-md transition-colors"
            >
              <X size={14} />
            </button>
            <div className="mt-3 text-sm text-gray-700 flex items-center justify-center gap-2">
              <ImageIcon size={14} />
              <span>{file?.name} ({(file?.size / 1024).toFixed(1)} KB)</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center
              ${isDragActive ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700 border border-emerald-300"}
              group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm`}>
              <Upload size={28} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">
                {isDragActive ? "Drop your leaf image here!" : "Upload a Leaf Image"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Drag &amp; drop or <span className="text-emerald-700 font-bold underline">click to browse</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP — max 10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Info banner */}
      {!preview && (
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>For best results, use a clear, close-up photo of a single leaf against a neutral background.</span>
        </div>
      )}

      {preview && (
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full btn-primary py-3 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Analyzing Leaf...
            </>
          ) : (
            <>🔍 Detect Disease</>
          )}
        </button>
      )}
    </div>
  );
}
