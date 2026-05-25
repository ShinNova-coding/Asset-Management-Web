"use client"

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { ArrowLeft, Package, Settings, ImageIcon, Upload, X, MapPin, Phone, User } from "lucide-react";

export default function ActivityUpdate() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editItem = location.state?.editItem;
  const isEditMode = !!editItem;

  const [formData, setFormData] = useState({
    id: "",
    name: "", 
    action: "", 
    assigndate: "",
    returndate: "",
    actions: "",
    category: "",
    softwareName: "",
    phone: "",
    address: ""
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formatToInputDate = (dateString: string | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
  };

  useEffect(() => {
    if (editItem) {
      setFormData({
        id: editItem.id || "",
        name: editItem.name || editItem.username || "", // Pulls existing user names safely
        action: editItem.action || "",
        assigndate: formatToInputDate(editItem.assigndate),
        returndate: formatToInputDate(editItem.returndate),
        actions: editItem.actions || "",
        category: editItem.category || "",
        softwareName: editItem.softwareName || "",
        phone: editItem.phone || "",
        address: editItem.address || ""
      });

      if (editItem.image) {
        setImagePreview(editItem.image);
      }
    }
  }, [editItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const goBack = () => {
    navigate("/activity"); 
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const processImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...editItem, 
      ...formData,
      id: editItem?.id || formData.id || `AST-${Math.floor(1000 + Math.random() * 9000)}`,
      username: formData.name, // Ensure username matches what your detail view expects
      image: imagePreview
    };

    console.log("Submitting asset dataset payload:", payload);
    
    // Smooth redirect back to your activity routing engine table dashboard
    navigate("/activity", { state: { updatedItem: payload } });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 px-6 py-10 md:px-12 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Action Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="space-y-1.5">
            <button 
              type="button"
              onClick={goBack}
              className="inline-flex items-center text-xs font-semibold text-blue-600 border border-slate-200 bg-white rounded-lg px-3 py-1.5 hover:bg-slate-50 shadow-xs transition-colors"
            >
              <ArrowLeft size={14} className="mr-1.5 text-blue-500" />
              Back to Logs
            </button>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isEditMode ? `Modify Asset: ${editItem.id}` : "Register New IT Asset"}
            </h1>
           
          </div>
        </div>

        {/* Master Content Dashboard Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Form Content Hub */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              {/* Box Section 1: Core Details */}
              <section className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
                    <Package size={15} />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Asset Specifications</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Action Status</label>
                    <input 
                      type="text" 
                      name="action"
                      value={formData.action}
                      onChange={handleInputChange}
                      placeholder="e.g. Active, Returned, Pending" 
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm bg-slate-50/50 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" 
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Asset Category/Model Name</label>
                    <input 
                      type="text" 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g. MacBook Pro 16"  
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm bg-slate-50/50 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" 
                    />
                  </div>
                </div>
              </section>

              {/* Box Section 2: Timeline Loops */}
              <section className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="p-1.5 bg-amber-50 rounded-md text-amber-600">
                    <Settings size={15} />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Deployment</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Assign Date</label>
                    <input 
                      type="date" 
                      name="assigndate"
                      value={formData.assigndate}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm bg-slate-50/50 focus:bg-white transition-all text-slate-700" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Return Date (Optional)</label>
                    <input 
                      type="date" 
                      name="returndate"
                      value={formData.returndate}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm bg-slate-50/50 focus:bg-white transition-all text-slate-700" 
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-600">Assigned To (User Node Target)</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        name="name" // Changed back to dynamic payload binding key map identifier
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe" 
                        className="w-full pl-10 pr-3.5 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm bg-slate-50/50 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" 
                      />
                    </div>
                  </div>
                </div>
              </section>

             
              <section className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="p-1.5 bg-emerald-50 rounded-md text-emerald-600">
                    <MapPin size={15} />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Software House Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-600">Software House Name</label>
                    <input 
                      type="text" 
                      name="softwareName"
                      value={formData.softwareName}
                      onChange={handleInputChange}
                      placeholder="e.g. Insight Enterprise Inc." 
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm bg-slate-50/50 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Phone No</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +95 9*********" 
                        className="w-full pl-10 pr-3.5 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm bg-slate-50/50 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Address</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. Yangon" 
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm bg-slate-50/50 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" 
                    />
                  </div>
                </div>
              </section>

              {/* Action Operations Panel */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={goBack} 
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-xs shadow-xs transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm text-xs transition-colors"
                >
                  {isEditMode ? "Save" : "Register"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column Canvas Sidebar: Upload Evidence Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 sticky top-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ImageIcon size={16} className="text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Evidence Documentation</h2>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <div 
              onClick={handleDropzoneClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`aspect-square w-full bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 space-y-2.5 hover:bg-slate-100/70 transition-all cursor-pointer group relative overflow-hidden ${
                imagePreview ? "border-solid border-slate-200 bg-white p-1.5" : ""
              }`}
            >
              {imagePreview ? (
                <div className="w-full h-full relative group/preview">
                  <img 
                    src={imagePreview} 
                    alt="Asset preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-lg">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md flex items-center gap-1.5 text-xs font-bold transition-all transform scale-95 group-hover/preview:scale-100"
                    >
                      <X size={14} />
                      Remove Media
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-2.5 bg-white border border-slate-100 rounded-lg shadow-xs group-hover:scale-105 transition-transform text-blue-500">
                    <Upload size={18} />
                  </div>
                  <div className="text-center space-y-0.5 px-4">
                    <p className="text-xs font-bold text-slate-600">
                      Upload asset record photo
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Drag and drop image or touch area
                    </p>
                  </div>
                  <p className="text-[9px] font-medium tracking-wide text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                    PNG, JPG • Max 5MB
                  </p>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}