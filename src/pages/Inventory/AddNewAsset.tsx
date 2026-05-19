import React from 'react';
import { ArrowLeft, Package, Settings, Calendar, Hash, Image as ImageIcon, Upload } from 'lucide-react';

const AddNewAsset = () => {
  const goBack = () => {
    window.location.href = "/inventory"; 
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <button 
            onClick={goBack}
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Inventory
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Register IT New Asset</h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Form Card (Shrunk to span 2/3) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <form className="p-8 space-y-8">
              
              {/* Section 1: Asset Details */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <Package size={18} className="text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Asset Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Asset Name</label>
                    <input type="text" placeholder="e.g. MacBook Pro M2" className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Asset ID / Tag</label>
                    <input type="text" placeholder="AF-LP-1011" className="w-full px-3 py-2 rounded-md border border-slate-300 bg-slate-50 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Serial Number</label>
                    <input type="text" placeholder="SN-99210" className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Asset Category</label>
                    <input type="text" placeholder="e.g. Laptops" className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm" />
                  </div>
                </div>
              </section>

              {/* Section 2: Warranty & Procurement (TWO BOXES ON SAME LINE) */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <Settings size={18} className="text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Warranty & Procurement</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Purchase Date</label>
                    <input type="date" className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Warranty Expiration</label>
                    <input type="text" placeholder="Exp. Oct 2026" className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                </div>
              </section>

              {/* Section 3: Vendor Details */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <Settings size={18} className="text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Vendor Details</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Vendor Name</label>
                    <input type="text" placeholder="e.g. Insight Enterprise INC" className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Phone No</label>
                    <input type="text" className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Vendor Address</label>
                    <input type="text" placeholder="City" className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm" />
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={goBack} className="px-5 py-2 rounded-md border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm text-xs">Save Asset</button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: Asset Photo Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ImageIcon size={18} className="text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Asset Photo</h2>
            </div>
            
            <div className="aspect-square w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 space-y-2 hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <Upload size={24} className="text-blue-500" />
              </div>
              <p className="text-[11px] font-medium px-4 text-center">Click to upload or drag and drop asset image</p>
              <p className="text-[10px]">PNG, JPG up to 5MB</p>
            </div>
            
           
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddNewAsset;