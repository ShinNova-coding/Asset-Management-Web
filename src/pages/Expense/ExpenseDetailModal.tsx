import React from 'react';
import { X, Calendar, Tag, Clock, User, Phone, MapPin, HardDrive } from 'lucide-react';

// nested objects များအတွက် Interface သတ်မှတ်ခြင်း
interface UserData {
  id: string;
  employee_id: string;
  name: string;
  email: string;
}

interface MaintenanceData {
  id: string;
  vendor: string;
  vendor_phno: string | null;
  vendor_address: string | null;
  duration: number;
  payment: string;
  completed_date: string;
}

interface AssetData {
  id: string;
  asset_code: string;
  name: string;
}

// Backend Response Interface ကို nested data များထည့်သွင်း၍ update လုပ်ခြင်း
export interface ExpenseDetailData {
  id: string;
  users_id: string;
  maintenances_id: string | null;
  assets_id: string | null;
  approved_by: string | null;
  title: string;
  expense_type: string;
  cost: number;
  status: 'canceled' | 'requested' | 'approved' | string;
  remark: string | null;
  description: string | null;
  expense_date: string;
  created_at: string;
  updated_at: string;
  // API က ပါလာတဲ့ nested object data များ
  user?: UserData | null;
  maintenance?: MaintenanceData | null;
  asset?: AssetData | null;
}

interface ExpenseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseDetailData | null;
}

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({ isOpen, onClose, expense }) => {
  if (!isOpen || !expense) return null;

  // Status Style သတ်မှတ်ချက်
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'requested':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'canceled':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  // Maintenance Data ရှိရင် API က data ယူမယ်၊ မရှိရင် fallback သုံးမယ်
  const maintenanceDetails = {
    maintenance_id: expense.maintenance?.id || expense.maintenances_id || "N/A",
    completed_date: expense.maintenance?.completed_date || expense.expense_date,
    vendor: expense.maintenance?.vendor || "Tech Repair Services",
    vendor_phno: expense.maintenance?.vendor_phno || "09123456789",
    vendor_address: expense.maintenance?.vendor_address || "No. 123, Main Street, Yangon",
    payment: expense.maintenance?.payment || "paid",
    duration: expense.maintenance?.duration || "5"
  };

  return (
    <>
      {/* Background Overlay Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity" onClick={onClose} />

      {/* Slide-over Right Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col font-sans animate-slide-in">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusBadge(expense.status)}`}>
              {expense.status}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 truncate max-w-[360px]">{expense.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content Box */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* General Expense Cost Section */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Cost</p>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {Number(expense.cost).toLocaleString()} <span className="text-sm font-medium text-slate-500">MMK</span>
            </p>
          </div>

          {/* Primary Metadata List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expense Information</h4>
            
            <div className="grid grid-cols-2 gap-4 bg-white border border-slate-100 rounded-xl p-4 shadow-xs">
              <div className="flex items-start gap-2.5">
                <Calendar className="text-slate-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Expense Date</p>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">{expense.expense_date}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Tag className="text-slate-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Expense Type</p>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mt-0.5">{expense.expense_type}</p>
                </div>
              </div>
            </div>

            {/* 📋 IDs နေရာမှာ Name တွေနဲ့ လှလှပပ အစားထိုးပြသတဲ့ နေရာ */}
            <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-400">Requested By:</span>
                <span className="font-semibold text-slate-800 bg-white px-2 py-1 rounded border border-slate-100 shadow-xs">
                  {expense.user?.name || "Unknown User"} 
                  <span className="text-[10px] text-slate-400 font-normal ml-1">({expense.user?.employee_id || 'N/A'})</span>
                </span>
              </div>

              {/* Asset Type ဖြစ်ခဲ့ရင် Asset Name ပြမယ် */}
              {expense.asset && (
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                  <span className="text-slate-400 flex items-center gap-1"><HardDrive size={13}/> Target Asset:</span>
                  <span className="font-semibold text-slate-800">
                    {expense.asset.name} <span className="text-[10px] font-mono text-indigo-500">({expense.asset.asset_code})</span>
                  </span>
                </div>
              )}

              {/* Approved status ဖြစ်ပြီး approved_by ရှိရင် သက်ဆိုင်ရာ လူနာမည်ပြမယ် (လက်ရှိ API မှာ users_id နဲ့တူနေလို့ အသုံးချထားပါတယ်) */}
              {expense.approved_by && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Approved By:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50/50 px-2 py-0.5 rounded border border-emerald-100">
                    {expense.approved_by === expense.user?.id ? expense.user?.name : "Authorized Admin"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 🛠️ Dynamic Maintenance Additional View Card */}
          {expense.expense_type === 'maintenance' && (
            <div className="space-y-3 animate-fade-in">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maintenance Summary</h4>
              <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 space-y-4">
                
                {/* Vendor Metadata */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg border border-indigo-100 text-indigo-600"><User size={16} /></div>
                  <div>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Vendor Business</p>
                    <p className="text-sm font-bold text-slate-800">{maintenanceDetails.vendor}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-indigo-100/50 pt-3">
                  <div className="flex items-center gap-2">
                    <Phone className="text-slate-400" size={14} />
                    <div>
                      <p className="text-[10px] text-slate-400">Contact No.</p>
                      <p className="text-xs font-semibold text-slate-700">{maintenanceDetails.vendor_phno}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-slate-400" size={14} />
                    <div>
                      <p className="text-[10px] text-slate-400">Duration</p>
                      <p className="text-xs font-semibold text-slate-700">{maintenanceDetails.duration} Days</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 border-t border-indigo-100/50 pt-3">
                  <MapPin className="text-slate-400 shrink-0 mt-0.5" size={14} />
                  <div>
                    <p className="text-[10px] text-slate-400">Vendor Address</p>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{maintenanceDetails.vendor_address}</p>
                  </div>
                </div>

                {/* Maintenance ID & Payment Tag */}
                <div className="flex items-center justify-between bg-white border border-indigo-100/60 px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <span className="font-medium">Payment:</span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm uppercase text-[10px]">
                      {maintenanceDetails.payment}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">MID: {maintenanceDetails.maintenance_id.slice(0, 8)}...</span>
                </div>

              </div>
            </div>
          )}

          {/* Remark section */}
          {expense.remark && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Remarks</h4>
              <div className="bg-rose-50/50 border border-rose-100 text-rose-800 text-xs p-3.5 rounded-xl leading-relaxed font-medium">
                "{expense.remark}"
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="w-full sm:w-auto px-5 py-2 bg-slate-400 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-xs transition">
            Close Detail
          </button>
        </div>
      </div>
    </>
  );
};