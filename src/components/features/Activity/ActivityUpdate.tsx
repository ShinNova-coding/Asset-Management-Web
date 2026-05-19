"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"; 
import { ArrowLeft, Package, Settings, ImageIcon, Upload, X } from 'lucide-react';

const ActivityUpdate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editItem = location.state?.editItem;
  const isEditMode = !!editItem;

  // Track state keys aligned perfectly with the input HTML fields below
  const [formData, setFormData] = useState({
    id: '',
    name:'',
    status: '',
    assigndate: '',
    returndate: '',
    actions: '',
    category: '',
   
    shopName: '',
    phone: '',
    address: ''
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formatToInputDate = (dateString: string | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    return ""; 
  };

 
  useEffect(() => {
    if (editItem) {
      setFormData({
        id: editItem.id || '',
        name:editItem.name || '',
        status: editItem.action || '',
        assigndate: formatToInputDate(editItem.assigndate),
        returndate: formatToInputDate(editItem.returndate),
        actions: editItem.actions || '',
        category: editItem.category || '',
       
        shopName: editItem.shopName || '',
        phone: editItem.phone || '',
        address: editItem.address || ''
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
      assetId: editItem?.id || undefined, 
      ...formData,
      image: selectedImage || imagePreview
    };

    console.log("Submitting asset dataset payload:", payload);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="space-y-2">
          <button 
            type="button"
            onClick={goBack}
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Activity
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? `Modify Asset ID: ${editItem.id}` : "Register IT New Asset"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              <section className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <Package size={18} className="text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Employee & Asset Info</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Status</label>
                    <input 
                      type="text" 
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      placeholder="e.g. Active, Pending, Returned" 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Asset Category</label>
                    <input 
                      type="text" 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g. Laptops" 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <Settings size={18} className="text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Assignment Timeline</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* FIXED: Renamed keys to match target data model metrics (assigndate / returndate) */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Assign Date</label>
                    <input 
                      type="date" 
                      name="assigndate"
                      value={formData.assigndate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Return Date</label>
                    <input 
                      type="date" 
                      name="returndate"
                      value={formData.returndate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Warranty Expiration</label>
                    <input 
                      type="text" 
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      placeholder="2 years" 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <Settings size={18} className="text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Shop House Details</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Shop House Name</label>
                    <input 
                      type="text" 
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                      placeholder="e.g. Insight Enterprise INC" 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Phone No</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="09*********" 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Shop House Address</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="City" 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={goBack} className="px-5 py-2 rounded-md border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm text-xs">
                  {isEditMode ? "Update Asset" : "Save Asset"}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ImageIcon size={18} className="text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Asset Photo</h2>
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
              className={`aspect-square w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 space-y-2 hover:bg-slate-100 transition-colors cursor-pointer group relative overflow-hidden ${
                imagePreview ? 'border-solid border-slate-300 bg-white p-2' : ''
              }`}
            >
              {imagePreview ? (
                <div className="w-full h-full relative group/preview">
                  <img 
                    src={imagePreview} 
                    alt="Asset preview" 
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-md">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transform transition-transform duration-200 hover:scale-110 flex items-center gap-1.5 text-xs font-medium"
                    >
                      <X size={16} />
                      Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <Upload size={24} className="text-blue-500" />
                  </div>
                  <p className="text-[11px] font-medium px-4 text-center text-slate-600">
                    Click to upload or drag and drop asset image
                  </p>
                  <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ActivityUpdate;