import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ArrowLeft, Calendar, Wrench, ShieldCheck, FileText, Image as ImageIcon } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const MaintenanceDetailsForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        console.log("[MaintenanceDetail] Fetching ID:", id)
        // Pass maintenance_id as a query parameter for GET requests
        const result = await apiFetch(`/maintenance/maintenance_id?maintenance_id=${id}`);
        console.log("[MaintenanceDetail] Raw API response:", result)

        // Handle both { data: {...} } and direct object responses
        const record = result?.data ?? result ?? null;
        setRecord(record);
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

  // Helper to color-code status badges
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 min-h-screen font-sans">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header Section with Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maintenance Details</h1>
          
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
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
            <Wrench size={16} className="text-indigo-500" /> Asset Info
          </h2>
          
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Code</p>
            <p className="text-slate-900 font-medium">{record.asset?.asset_code ?? "-"}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Name</p>
            <p className="text-slate-900 font-medium">{record.asset?.name ?? "-"}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</p>
            <p className="text-slate-900 font-medium">{record.category?.name ?? "-"}</p>
          </div>
        </div>

        {/* SECTION 2: Personnel & Assignment */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
            <ShieldCheck size={16} className="text-indigo-500" /> Personnel
          </h2>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Requested By (Employee)</p>
            <p className="text-slate-900 font-medium">{record.user?.name ?? "-"}</p>
            {record.user?.position && (
              <p className="text-xs text-slate-500">{record.user.position}</p>
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accepted / Approved By ID</p>
            <p className="text-slate-900 font-medium text-sm font-mono break-all">
              {record.accepted_by ?? "-"}
            </p>
          </div>
        </div>

        {/* SECTION 3: Issue Details */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
            <FileText size={16} className="text-indigo-500" /> Issue Details
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
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
            <Calendar size={16} className="text-indigo-500" /> Schedule & Timeline
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
        {record.image_url && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
              <ImageIcon size={16} className="text-indigo-500" /> Evidence Image
            </h2>
            <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden max-h-48 flex justify-center bg-slate-100">
              <img 
                src={record.image_url} 
                alt="Maintenance Evidence" 
                className="object-contain h-full w-auto max-h-40"
                onError={(e) => {
                  // Fallback layout clean-up if image route returns an asset crash
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MaintenanceDetailsForm;