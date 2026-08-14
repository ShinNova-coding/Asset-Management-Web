"use client"

import React from 'react'
import { X } from 'lucide-react'
import { 
  FiCalendar, 
  FiUser, 
  FiCpu, 
  FiFileText, 
  FiClock, 
  FiTag, 
  FiDollarSign, 
  FiTool, 
  FiPhone, 
  FiMapPin 
} from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
  
  user?: UserData | null;
  maintenance?: MaintenanceData | null;
  asset?: AssetData | null;
  asset_name?: string | null;
  asset_code?: string | null;
}

interface ExpenseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseDetailData | null;
}

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({ isOpen, onClose, expense }) => {
  if (!isOpen || !expense) return null;

  const isActive = expense.status?.toLowerCase() === "approved" || expense.status?.toLowerCase() === "active";
  const isRequested = expense.status?.toLowerCase() === "requested";
  const isCanceled = expense.status?.toLowerCase() === "canceled";

  const getStatusBadgeClass = () => {
    if (isActive) return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
    if (isRequested) return "bg-blue-50 text-blue-700 border border-blue-200/60";
    if (isCanceled) return "bg-rose-50 text-rose-700 border border-rose-200/60";
    return "bg-slate-50 text-slate-700 border border-slate-200";
  };

  const getStatusDotClass = () => {
    if (isActive) return "bg-emerald-500";
    if (isRequested) return "bg-blue-500";
    if (isCanceled) return "bg-rose-500";
    return "bg-slate-400";
  };

  const maintenanceDetails = {
    maintenance_id: expense.maintenance?.id || expense.maintenances_id || "N/A",
    completed_date: expense.maintenance?.completed_date || expense.expense_date,
    vendor: expense.maintenance?.vendor || "Tech Repair Services",
    vendor_phno: expense.maintenance?.vendor_phno || "09123456789",
    vendor_address: expense.maintenance?.vendor_address || "No. 123, Main Street, Yangon",
    payment: expense.maintenance?.payment || "paid",
    duration: expense.maintenance?.duration || "5"
  };
  const assetName = expense.asset?.name || expense.asset_name || "";
  const assetCode = expense.asset?.asset_code || expense.asset_code || "";
  const hasAssetDetails = Boolean(assetName || assetCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Backdrop - နောက်ခံကို ဝါးစေရန် backdrop-blur-sm သုံးထားပါသည် */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />

      {/* Centered Modal Content Card */}
      <div className="relative w-[95%] sm:w-full max-w-2xl max-h-[90vh] bg-[#F8FAFC] shadow-2xl rounded-2xl flex flex-col font-sans text-slate-900 antialiased border border-slate-200/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-slate-200/80 shrink-0">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#7C3AED] truncate max-w-[340px] md:max-w-[420px]">
              Expense Detail
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide shadow-sm uppercase ${getStatusBadgeClass()}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${getStatusDotClass()}`}></span>
              {expense.status}
            </span>
            <Button onClick={onClose} variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Expense Title Details */}
          <Card className="border border-slate-200/80 shadow-sm bg-white overflow-hidden rounded-xl">
            <CardContent className="p-5 space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold uppercase text-[#7C3AED]">
                <FiFileText className="w-4 h-4" />
                Expense Title
              </div>
              <p className="text-base font-bold text-slate-800 mt-1">{expense.title}</p>
            </CardContent>
          </Card>

          {/* Total Cost Card */}
          <Card className="border border-slate-200/80 shadow-sm bg-white overflow-hidden rounded-xl">
            <CardContent className="p-5 space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold uppercase text-[#7C3AED]">
                <FiDollarSign className="w-4 h-4" />
                Total Cost
              </div>
              <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                {Number(expense.cost).toLocaleString()} <span className="text-sm font-medium text-slate-500">MMK</span>
              </p>
            </CardContent>
          </Card>

          {/* User & Asset Split Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Detail Card */}
            <Card className="border border-slate-200/80 shadow-sm bg-white overflow-hidden rounded-xl">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold uppercase text-[#7C3AED]">
                  <FiUser className="w-4 h-4" />
                  User Detail
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500/90 uppercase tracking-normal">Employee ID</label>
                    <p className="font-bold text-slate-900 text-base mt-0.5">{expense.user?.employee_id || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500/90 uppercase tracking-normal">Employee Name</label>
                    <p className="font-bold text-slate-900 text-base mt-0.5">{expense.user?.name || "Unknown User"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {hasAssetDetails && (
              <Card className="border border-slate-200/80 shadow-sm bg-white overflow-hidden rounded-xl">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase text-[#7C3AED]">
                    <FiCpu className="w-4 h-4" />
                    Hardware Allocation
                  </div>
                  <div className="space-y-3">
                    {assetName && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-500/90 uppercase tracking-normal">Asset Name</label>
                        <p className="font-bold text-slate-900 text-base mt-0.5">{assetName}</p>
                      </div>
                    )}
                    {assetCode && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-500/90 uppercase tracking-normal">Asset Code</label>
                        <p className="font-bold text-slate-900 text-base mt-0.5">{assetCode}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Timeline & Metadata Card */}
          <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold uppercase text-[#7C3AED]">
                <FiCalendar className="w-4 h-4" />
                Timeline
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                <div className="space-y-0.5 border-l-2 border-slate-200 pl-3">
                  <label className="block text-xs font-semibold text-slate-500/90 uppercase tracking-normal">Expense Date</label>
                  <p className="font-bold text-slate-900 text-base mt-0.5">{expense.expense_date}</p>
                </div>
                
                <div className="space-y-0.5 border-l-2 border-slate-200 pl-3">
                  <label className="block text-xs font-semibold text-slate-500/90 uppercase tracking-normal">Expense Type</label>
                  <div className="flex items-center gap-1 text-[#7C3AED] font-bold text-base uppercase mt-0.5">
                    <FiTag size={14} className="mt-0.5" />
                    {expense.expense_type}
                  </div>
                </div>
              </div>

              {expense.approved_by && (
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold uppercase tracking-normal text-xs">Approved By:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50/50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                    {expense.approved_by === expense.user?.id ? expense.user?.name : "Authorized Admin"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Maintenance Summary Section */}
          {expense.expense_type === 'maintenance' && (
            <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold uppercase text-[#7C3AED]">
                  <FiTool className="w-4 h-4" />
                  Maintenance Summary
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500/90 uppercase tracking-normal">Vendor Business</label>
                    <p className="font-bold text-slate-900 text-base mt-0.5">{maintenanceDetails.vendor}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500/90 uppercase tracking-normal">Contact No.</label>
                    <p className="font-bold text-slate-800 text-base mt-0.5 flex items-center gap-1.5">
                      <FiPhone size={14} className="text-slate-400" />
                      {maintenanceDetails.vendor_phno}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500/90 uppercase tracking-normal">Duration</label>
                    <p className="font-bold text-slate-800 text-base mt-0.5 flex items-center gap-1.5">
                      <FiClock size={14} className="text-slate-400" />
                      {maintenanceDetails.duration} Days
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500/90 uppercase tracking-normal">Payment Status</label>
                    <p className="mt-1">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                        {maintenanceDetails.payment}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-500/90 uppercase tracking-normal">Vendor Address</label>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed mt-1 flex items-start gap-1.5">
                    <FiMapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    {maintenanceDetails.vendor_address}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Remarks / Notes Section */}
          {expense.remark && (
            <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold uppercase text-[#7C3AED]">
                  <FiClock className="w-4 h-4" />
                  Admin Remarks
                </div>
                <div>
                  <p className="font-bold text-rose-800 text-base mt-1 bg-rose-50/40 border border-rose-100/60 p-3 rounded-lg">
                    {expense.remark}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description Section */}
          {expense.description && (
            <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold uppercase text-[#7C3AED]">
                  <FiFileText className="w-4 h-4" />
                  Description
                </div>
                <p className="font-bold text-slate-800 text-base mt-1">
                  {expense.description}
                </p>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-white flex justify-end shrink-0">
          <Button 
            onClick={onClose} 
            className="w-full sm:w-auto px-5 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
          >
            Close Detail
          </Button>
        </div>
      </div>
    </div>
  );
};
