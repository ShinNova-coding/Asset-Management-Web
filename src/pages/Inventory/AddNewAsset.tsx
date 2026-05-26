"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"; 
import { ArrowLeft, Package, Settings, ImageIcon, Upload, X, Cpu } from 'lucide-react';

const AddNewAsset = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editItem = location.state?.editItem;
  const isEditMode = !!editItem;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    model: '',
    ram: '',
    storage: '',
    purchaseDate: '',
    warranty: '',
    shopName: '',
    phone: '',
    address: '',
    action: '' 
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formatToInputDate = (dateString: string) => {
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
        name: editItem.name || '',
        category: editItem.category || '',
        model: editItem.model || '',
        ram: editItem.ram || '',
        storage: editItem.storage || '',
        purchaseDate: formatToInputDate(editItem.purchase || editItem.purchaseDate),
        warranty: editItem.warranty || '',
        shopName: editItem.shopName || '',
        phone: editItem.phone || '',
        address: editItem.address || '',
        // Pull either .action or fallback to .status when loading an asset to edit
        action: editItem.action || editItem.status || ''
      });

      if (editItem.image) {
        setImagePreview(editItem.image);
      }
    }
  }, [editItem]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const goBack = () => {
    navigate("/inventory"); 
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

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please provide at least an Asset Name before saving.");
      return;
    }

    try {
      let finalizedImageString = imagePreview;
      if (selectedImage) {
        finalizedImageString = await convertImageToBase64(selectedImage);
      }

      const localRawData = localStorage.getItem("inventory_data");
      let currentInventory = localRawData ? JSON.parse(localRawData) : [];

      // Determine what the user typed, or default safely if left completely empty
      const updatedStatusText = formData.action.trim() || "Available";

      if (isEditMode) {
        // --- UPDATE CORNER ---
        currentInventory = currentInventory.map((item: any) => {
          if (item.asset === editItem.asset || item.id === editItem.id) {
            return {
              ...item,
              name: formData.name,
              category: formData.category || "Laptops",
              model: formData.model,
              ram: formData.ram,
              storage: formData.storage,
              purchase: formData.purchaseDate, 
              purchaseDate: formData.purchaseDate,
              warranty: formData.warranty,
              shopName: formData.shopName,
              phone: formData.phone,
              address: formData.address,
              image: finalizedImageString,
              status: updatedStatusText, // Fixed: Syncs live status updates back to table columns
              action: updatedStatusText
            };
          }
          return item;
        });
      } else {
        // --- CREATE CORNER ---
        const generatedAssetId = `AST-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const newAssetPayload = {
          id: generatedAssetId, 
          asset: generatedAssetId,
          name: formData.name,
          category: formData.category || "Laptops",
          model: formData.model || "N/A",
          ram: formData.ram || "N/A",
          storage: formData.storage || "N/A",
          purchase: formData.purchaseDate || new Date().toISOString().split('T')[0],
          purchaseDate: formData.purchaseDate || new Date().toISOString().split('T')[0],
          warranty: formData.warranty || "No active arrangement logs found",
          shopName: formData.shopName,
          phone: formData.phone,
          address: formData.address,
          status: updatedStatusText, // Fixed: Directly injects whatever you types into status schema
          action: updatedStatusText, 
          image: finalizedImageString
        };

        currentInventory.unshift(newAssetPayload); 
      }

      localStorage.setItem("inventory_data", JSON.stringify(currentInventory));
      navigate("/inventory");

    } catch (err) {
      console.error("Failed to compile item bundle payload:", err);
      alert("An error occurred while saving your asset entry.");
    }
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
            Back to Inventory
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? `Modify Asset: ${editItem.asset}` : "Register New IT Asset"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              {/* Core Info */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <Package size={18} className="text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Asset Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Asset Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. MacBook Pro M3" 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Asset Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    >
                      <option value="">Select Category</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Desktops">Desktops</option>
                      <option value="Printers">Printers</option>
                      <option value="Monitors">Monitors</option>
                      <option value="Networking">Networking</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-600">Action Status</label>
                    <input 
                      type="text" 
                      name="action"
                      value={formData.action}
                      onChange={handleInputChange}
                      placeholder="e.g. Active, Returned, Pending,Maintenance" 
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm bg-slate-50/50 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" 
                    />
                  </div>
                </div>
              </section>

              {/* Hardware Specifications */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <Cpu size={18} className="text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Hardware Specifications</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Model</label>
                    <input 
                      type="text" 
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g. Apple M3 Max" 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">RAM</label>
                    <input 
                      type="text" 
                      name="ram"
                      value={formData.ram}
                      onChange={handleInputChange}
                      placeholder="e.g. 16GB" 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Storage</label>
                    <input 
                      type="text" 
                      name="storage"
                      value={formData.storage}
                      onChange={handleInputChange}
                      placeholder="e.g. 512GB SSD" 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                </div>
              </section>

              {/* Purchase Metadata */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <Settings size={18} className="text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Warranty & Procurement</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Purchase Date</label>
                    <input 
                      type="date" 
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Warranty Expiration</label>
                    <input 
                      type="text" 
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      placeholder="e.g. months/years" 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                </div>
              </section>

              {/* Vendor House Details */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <Settings size={18} className="text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Software House Details</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Software House Name</label>
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
                    <label className="text-xs font-semibold text-slate-600">Software House Address</label>
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

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={goBack} className="px-5 py-2 rounded-md border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm text-xs">
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>

          {/* Photo Management Sidebar Block */}
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

export default AddNewAsset;