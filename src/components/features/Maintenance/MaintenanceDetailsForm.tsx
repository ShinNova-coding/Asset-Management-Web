"use client"

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ArrowLeft, Calendar, Wrench, ShieldCheck, FileText, Image as ImageIcon, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const MaintenanceDetailsForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // 🌟 Image Preview Modal အတွက် State များ
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        console.log("[MaintenanceDetail] Fetching ID:", id);
        const result = await apiFetch(`/maintenance/maintenance_id?maintenance_id=${id}`);
        console.log("[MaintenanceDetail] Raw API response:", result);

        const rawRecord = result?.data ?? result ?? null;
        const detailRecord = Array.isArray(rawRecord) ? rawRecord[0] ?? null : rawRecord;
        setRecord(detailRecord);
      } catch (err) {
        console.error("Fetch detail error:", err);
        setRecord(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="p-6 text-center text-slate-500 font-medium">
          Loading maintenance details...
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <div className="p-6 text-center text-red-500 font-semibold bg-white rounded-lg border border-red-200 shadow-sm">
          Maintenance record not found
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    );
  }

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const categoryName = record.category?.name ?? record.asset?.category?.name ?? record.category_name ?? "-";
  const evidenceImage = record.image_url ?? record.preview_url ?? record.media?.[0]?.original_url ?? record.media?.[0]?.url;
  const voucherImage = record.voucher
    ? record.voucher.startsWith("data:")
      ? record.voucher
      : `data:image/jpeg;base64,${record.voucher}`
    : null;

  return (
    <div className="max-w-8xl mx-auto p-6 bg-[#e9e5ff] min-h-screen font-sans relative">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[#7C3AED] hover:text-purple-700 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header Section with Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#7C3AED]">Maintenance Details</h1>
        </div>
        <div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusClass(record.status)}`}>
            {record.status ? record.status.toUpperCase() : "UNKNOWN"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTION 1: Asset Information */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#7C3AED] flex items-center gap-2 border-b pb-2">
            <Wrench size={16} className="text-[#7C3AED]" /> Asset Info
          </h2>
          
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Code</p>
            <p className="text-slate-990 font-medium">{record.asset?.asset_code ?? "-"}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Name</p>
            <p className="text-slate-900 font-medium">{record.asset?.name ?? "-"}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</p>
            <p className="text-slate-900 font-medium">{categoryName}</p>
          </div>
        </div>

        {/* SECTION 2: Personnel & Assignment */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#7C3AED] flex items-center gap-2 border-b pb-2">
            <ShieldCheck size={16} className="text-[#7C3AED]" /> Personnel
          </h2>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Requested By (Employee)</p>
            <p className="text-slate-900 font-medium">{record.user?.name ?? "-"}</p>
            {record.user?.position && (
              <p className="text-xs text-slate-500">{record.user.position}</p>
            )}
          </div>

        
        </div>

        {/* SECTION 3: Vendor & Completion Details */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
          <h2 className="text-sm font-bold text-[#7C3AED] flex items-center gap-2 border-b pb-2">
            <Wrench size={16} className="text-[#7C3AED]" /> Vendor & Completion
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vendor</p>
              <p className="text-slate-900 font-medium">{record.vendor ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vendor Phone</p>
              <p className="text-slate-900 font-medium">{record.vendor_phno ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Status</p>
              <p className="text-slate-900 font-medium capitalize">{record.payment ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cost</p>
              <p className="text-slate-900 font-medium">
                {record.cost ? `${Number(record.cost).toLocaleString()} MMK` : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</p>
              <p className="text-slate-900 font-medium">{record.duration ? `${record.duration} Days` : "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vendor Address</p>
              <p className="text-slate-900 font-medium">{record.vendor_address ?? "-"}</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Issue Details */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
          <h2 className="text-sm font-bold text-[#7C3AED] flex items-center gap-2 border-b pb-2">
            <FileText size={16} className="text-[#7C3AED]" /> Issue Details
          </h2> 

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issue Type</p>
              <p className="text-slate-900 font-medium capitalize">{record.issue_type ?? "-"}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Problem Description</p>
              <p className="text-slate-900 font-medium whitespace-pre-wrap">{record.problem_description ?? "-"}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Remark</p>
            <p className="text-slate-900 font-medium italic">{record.remark ?? "-"}</p>
          </div>
        </div>

        {/* SECTION 4: Timeline */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#7C3AED] flex items-center gap-2 border-b pb-2">
            <Calendar size={16} className="text-[#7C3AED]" /> Schedule & Timeline
          </h2>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maintenance Date</p>
              <p className="text-slate-900 font-medium">{record.maintenance_date ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Date</p>
              <p className="text-slate-900 font-medium">{record.completed_date ?? "-"}</p>
            </div>
          </div>
        </div>

        {/* SECTION 5: Evidence Attachment */}
        {evidenceImage && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-[#7C3AED] flex items-center gap-2 border-b pb-2">
              <ImageIcon size={16} className="text-[#7C3AED]" /> Evidence Image
            </h2>
            <div 
              onClick={() => setIsImageModalOpen(true)}
              className="mt-2 border border-slate-200 rounded-lg overflow-hidden max-h-48 flex justify-center bg-slate-100 cursor-zoom-in hover:opacity-90 transition-all group relative shadow-2xs"
              title="Click to zoom image"
            >
              <img 
                src={evidenceImage} 
                alt="Maintenance Evidence" 
                className="object-contain h-full w-auto max-h-40 p-1"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-xs">Click to view large</span>
              </div>
            </div>
          </div>
        )}

        {voucherImage && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-[#7C3AED] flex items-center gap-2 border-b pb-2">
              <ImageIcon size={16} className="text-[#7C3AED]" /> Voucher Receipt
            </h2>
            <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden max-h-48 flex justify-center bg-slate-100 shadow-2xs">
              <img 
                src={voucherImage} 
                alt="Voucher Receipt" 
                className="object-contain h-full w-auto max-h-40 p-1"
              />
            </div>
          </div>
        )}

      </div>

      {/* ── 🖼️ EVIDENCE IMAGE LIGHTBOX MODAL OVERLAY ─────────────────────────────────── */}
      {isImageModalOpen && evidenceImage && (
        <div 
          onClick={() => setIsImageModalOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 p-2 rounded-full transition-all focus:outline-none z-55"
            title="Close preview"
          >
            <X size={22} />
          </button>
          
          {/* Modal Container */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-4xl max-h-[85vh] rounded-lg overflow-hidden bg-white/5 p-2 flex items-center justify-center"
          >
            <img 
              src={evidenceImage} 
              alt="Maintenance Evidence Large View" 
              className="object-contain max-w-full max-h-[80vh] rounded-md shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default MaintenanceDetailsForm;
