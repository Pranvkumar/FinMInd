/**
 * ScanUpload.jsx — Drag-and-drop receipt scanner
 * 
 * "Scan & Save" section: Users drag/browse a receipt image,
 * the AI extracts amount/description/category, then a live
 * preview modal lets them confirm or edit before saving.
 */

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ScanLine, Upload, ImagePlus, Loader2, Camera, Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import api from "../api/axios";
import ReceiptPreviewModal from "./ReceiptPreviewModal";

const ScanUpload = ({ onTransactionAdded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [scanError, setScanError] = useState(null);
  const inputRef = useRef(null);

  // ── Handle file selection ────────────────────
  const processFile = useCallback(async (file) => {
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, WebP, or GIF image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5 MB.");
      return;
    }

    // Show image preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
    setImageFile(file);

    // Send to AI
    setScanning(true);
    setExtractedData(null);
    setScanError(null);

    try {
      const formData = new FormData();
      formData.append("receipt", file);

      const { data } = await api.post("/receipts/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setExtractedData(data.extracted);
        setShowModal(true);
        toast.success("Receipt scanned successfully!");
      }
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to scan receipt. Try again.";
      const detail =
        err.response?.data?.detail || err.message || "Unknown error";
      setScanError({ message, detail });
      toast.error(message);
    } finally {
      setScanning(false);
    }
  }, []);

  const resetState = () => {
    setImagePreview(null);
    setImageFile(null);
    setExtractedData(null);
    setShowModal(false);
    setScanError(null);
  };

  // ── Drag handlers ───────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    processFile(file);
    e.target.value = ""; // allow re-selecting same file
  };

  // ── Save confirmed transaction(s) ─────────
  const handleSave = async (editedData) => {
    try {
      // editedData is now an array of transactions
      const items = Array.isArray(editedData) ? editedData : [editedData];

      const { data } = await api.post("/receipts/save", {
        transactions: items,
      });

      if (data.success) {
        const count = data.transactions.length;
        toast.success(
          count > 1 ? `${count} Transactions Saved` : "Transaction Saved",
          {
            description:
              count > 1
                ? `Saved ${count} transactions from your screenshot`
                : `₹${items[0].amount} → ${data.transactions[0].category.icon} ${data.transactions[0].category.name}`,
          }
        );
        if (onTransactionAdded) {
          // Add all saved transactions
          data.transactions.forEach((tx) => onTransactionAdded(tx));
        }
        resetState();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to save transaction(s)."
      );
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-violet-500/15 p-2">
            <ScanLine size={16} className="text-violet-400" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-200">
              Scan & Save
            </h2>
            <p className="text-xs text-slate-500">
              Upload a receipt, bill, or payment app screenshot
            </p>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !scanning && inputRef.current?.click()}
          className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
            dragActive
              ? "border-violet-400 bg-violet-500/10"
              : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50"
          } ${scanning ? "pointer-events-none" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileInput}
            className="hidden"
          />

          {scanning ? (
            /* Scanning animation */
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Receipt"
                    className="h-32 w-auto rounded-xl object-cover opacity-50"
                  />
                )}
                {/* Scanning light effect */}
                <motion.div
                  animate={{ y: [0, 120, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-0 right-0 top-0 h-1 rounded-full bg-linear-to-r from-transparent via-violet-400 to-transparent shadow-lg shadow-violet-400/50"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-violet-400">
                <Loader2 size={16} className="animate-spin" />
                AI is scanning your receipt…
              </div>
            </div>
          ) : imagePreview && !showModal ? (
            /* Show thumbnail after failed scan with error details */
            <div className="flex flex-col items-center justify-center py-10">
              <img
                src={imagePreview}
                alt="Receipt"
                className="mb-3 h-24 w-auto rounded-xl object-cover opacity-60"
              />
              {scanError ? (
                <div className="mx-4 w-full max-w-sm space-y-2">
                  <div className="flex items-center justify-center gap-2 text-rose-400">
                    <AlertCircle size={16} strokeWidth={2} />
                    <span className="text-sm font-medium">{scanError.message}</span>
                  </div>
                  <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-3">
                    <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      <Info size={11} strokeWidth={2} />
                      Error Details
                    </div>
                    <p className="text-xs leading-relaxed text-slate-400">
                      {scanError.detail}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetState();
                    }}
                    className="mx-auto mt-2 flex items-center gap-1.5 rounded-xl bg-slate-800/60 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700/60"
                  >
                    Try Another Image
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Click or drop another image to try again
                </p>
              )}
            </div>
          ) : (
            /* Empty drop zone */
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 rounded-2xl bg-slate-800/60 p-4">
                <ImagePlus
                  size={32}
                  className="text-slate-500"
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-sm font-medium text-slate-300">
                Drop receipt or screenshot here
              </p>
              <p className="mt-1 text-xs text-slate-500">
                or click to browse • Supports receipts, GPay, PhonePe, bank screenshots
              </p>

              {/* Mobile camera shortcut */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="mt-4 flex items-center gap-1.5 rounded-xl bg-violet-600/15 px-4 py-2 text-xs font-medium text-violet-400 transition hover:bg-violet-600/25 md:hidden"
              >
                <Camera size={14} strokeWidth={2} />
                Take Photo
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Preview Modal */}
      {showModal && extractedData && (
        <ReceiptPreviewModal
          imagePreview={imagePreview}
          extractedData={extractedData}
          onSave={handleSave}
          onClose={resetState}
        />
      )}
    </>
  );
};

export default ScanUpload;
