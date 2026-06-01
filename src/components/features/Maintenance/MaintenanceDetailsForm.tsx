import React from 'react';
import { Box, User, FileText, ArrowLeft, Phone, MapPin, Clock } from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";
import { maintenanceData } from "@/data/maintenance";

const MaintenanceDetailsForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const record = maintenanceData.find(
  (m) => m["asset ID"] === decodeURIComponent(id ?? "")
);

// ✅ ADD THIS
const [paymentMethod, setPaymentMethod] = React.useState(
  record?.paymentMethod || "Other"
);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 min-h-screen font-sans">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Maintenance Details
      </h1>

      {/* --- Maintenance Details Card --- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Box size={22} />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            Asset Core Infrormation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Employee Name</p>
            <p className="text-slate-900 font-medium">{record?.["employee name"] || "-"}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Asset ID</p>
            <p className="text-slate-900 font-medium">{record?.["asset ID"] || "-"}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Category</p>
            <p className="text-slate-900 font-medium">{record?.category || "-"}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Remark</p>
            <p className="text-slate-900 font-medium">{record?.remark || "-"}</p>
          </div>

        </div>
      </div>

      {/* --- Vendor Details Card --- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <FileText size={22} />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            Billing Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Vendor Name</p>
            <p className="text-slate-900 font-medium">{record?.vendorName || "-"}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Vendor Address</p>
            <p className="text-slate-900 font-medium">{record?.vendorAddress || "-"}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Phone Number</p>
            <p className="text-slate-900 font-medium">{record?.vendorPhone || "-"}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Estimated Cost</p>
            <p className="text-slate-900 font-medium">
              ${record?.estimatedCost || "0"}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Duration Time</p>
            <p className="text-slate-900 font-medium">{record?.durationTime || "-"}</p>
          </div>
<div>
  <p className="text-xs font-bold text-slate-400 uppercase mb-2">
    Payment 
  </p>

  <select
    value={paymentMethod}
    onChange={(e) => setPaymentMethod(e.target.value)}
    className=" px-3 py-2 border border-slate-300 rounded-xl text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <option value="KBZPay">KBZPay</option>
    <option value="WavePay">WavePay</option>
    <option value="Other">Other</option>
  </select>
</div>
        </div>
      </div>

    </div>
  );
};

export default MaintenanceDetailsForm;