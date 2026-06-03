"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom"; 
import { ArrowLeft, Package, Settings, ImageIcon, Upload, X, Cpu } from 'lucide-react';

const AddNewAsset = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeId } = useParams<{ id: string }>(); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stateId = location.state?.id;
  const stateEditItem = location.state?.editItem;

  const isEditMode = !!stateEditItem || !!stateId || !!routeId;

  const [formData, setFormData] = useState({
    assetId: '', 
    name: '',
    category: 'Laptops', 
    model: '',
    ram: '',
    storage: '',
    serial_number: '', 
    purchased_date: '', 
    warranty: '',
    action: 'available' 
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
    if (!isEditMode) {
      setFormData({
        assetId: '',
        name: '',
        category: 'Laptops',
        model: '',
        ram: '',
        storage: '',
        serial_number: '',
        purchased_date: '',
        warranty: '',
        action: 'available'
      });
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    let activeItem = stateEditItem;
    const targetId = stateId || routeId;

    if (!activeItem && targetId) {
      const localRawData = localStorage.getItem("inventory_data");
      if (localRawData) {
        const currentInventory = JSON.parse(localRawData);
        activeItem = currentInventory.find((item: any) => 
          item.asset_id === targetId || item.id === targetId
        );
      }
    }

    if (activeItem) {
      let resolvedCategoryStr = "Laptops";
      if (activeItem.category) {
        resolvedCategoryStr = typeof activeItem.category === "object" 
          ? activeItem.category.name 
          : activeItem.category;
      }

      setFormData({
        assetId: activeItem.asset_id || activeItem.id || String(targetId || ''),
        name: activeItem.name || '',
        category: resolvedCategoryStr || 'Laptops',
        model: activeItem.model || '',
        ram: activeItem.ram_capacity || activeItem.ram || '',
        storage: activeItem.storage || '',
        serial_number: activeItem.serial_number || '',
        purchased_date: formatToInputDate(activeItem.purchased_date || activeItem.purchase_date || activeItem.purchase),
        warranty: activeItem.warranty_period || activeItem.warranty || '',
        action: activeItem.status || activeItem.action || 'available'
      });

      // 🌟 FIX: Safe URL Handling for preview_url & localhost issues
      const API_REAL_IP = "http://192.168.100.185:1010";
      let rawImageSource = activeItem.preview_url || activeItem.image_url || activeItem.image || "";

      if (rawImageSource) {
        if (rawImageSource.startsWith("data:image")) {
          setImagePreview(rawImageSource);
        } else if (rawImageSource.startsWith("http://localhost")) {
          const correctedUrl = rawImageSource.replace("http://localhost", API_REAL_IP);
          setImagePreview(correctedUrl);
        } else if (rawImageSource.startsWith("http")) {
          setImagePreview(rawImageSource);
        } else {
          const cleanPath = rawImageSource.startsWith("/") ? rawImageSource : `/${rawImageSource}`;
          setImagePreview(`${API_REAL_IP}${cleanPath}`);
        }
      }
    } else if (targetId) {
      setFormData(prev => ({ ...prev, assetId: String(targetId) }));
    }
  }, [stateId, stateEditItem, routeId, isEditMode]);

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

  const stripBase64Header = (base64String: string): string => {
    if (!base64String) return "";
    if (base64String.includes(",")) {
      return base64String.split(",")[1];
    }
    return base64String;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please provide at least an Asset Name before saving.");
      return;
    }

    if (!formData.serial_number.trim()) {
      alert("Serial Number is required by the server!");
      return;
    }

    try {
      let finalizedImageString = "";

      // 🌟 FIX: Backend ရဲ့ Image Required Validation ပြဿနာကို ကျော်ဖြတ်ရန် လှည့်ပြင်ခြင်း
      if (selectedImage) {
        // ၁။ အသုံးပြုသူက ပုံအသစ် ရွေးချယ်လိုက်ရင်
        const base64WithHeader = await convertImageToBase64(selectedImage);
        finalizedImageString = stripBase64Header(base64WithHeader);
      } else if (imagePreview && imagePreview.startsWith("data:")) {
        // ၂။ လက်ရှိ preview က Base64 စာသား ဖြစ်နေရင်
        finalizedImageString = stripBase64Header(imagePreview);
      } else {
        // ၃။ Edit Mode မှာ ပုံအသစ်မပြောင်းလဲဘဲ သိမ်းရင်ဖြစ်ဖြစ်၊ ပုံမရှိရင်ဖြစ်ဖြစ် စာသားအလွတ်မဖြစ်စေဘဲ Dummy 1x1 base64 ဖြည့်ပေးခြင်း
        const dummyWithHeader = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        finalizedImageString = stripBase64Header(dummyWithHeader);
      }

      const updatedStatusText = formData.action.trim() || "available";

      const categoryMap: Record<string, number> = {
        "Desktops": 1,
        "Laptops": 2,
        "Printers": 3,
        "Monitors": 4,
        "Networking": 5,
        "Accessories": 6
      };
      const resolvedCategoryId = categoryMap[formData.category] || 2;

      const assetPayload: Record<string, any> = {
        asset_id: formData.assetId.trim() || `AST-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name.trim(),
        serial_number: formData.serial_number.trim(),
        purchased_date: formData.purchased_date || new Date().toISOString().split('T')[0],
        warranty_period: parseInt(formData.warranty) || 12, 
        model: formData.model.trim() || "N/A",
        ram_capacity: formData.ram.trim() || "N/A",
        storage: formData.storage.trim() || "N/A",
        category_id: resolvedCategoryId, 
        status: updatedStatusText.toLowerCase(), 
        condition: "new",
        image: finalizedImageString, // 🌟 Image Field ကို Payload ထဲမှာ အမြဲတမ်း သေချာပေါက် ပါဝင်နေစေရမယ်
      };

      console.log("🚀 Payload sending to backend server stream:", assetPayload);

      const API_URL = "http://192.168.100.185:1010/api/asset"; 
      const targetId = stateEditItem?.asset_id || stateEditItem?.id || stateId || routeId;
      const url = isEditMode ? `${API_URL}/${targetId}` : API_URL;
      
      const method = isEditMode ? "PUT" : "POST";
      const currentToken = localStorage.getItem("token") || "11|z7kS1l7X1p4y6k4rhK3xiwiO6reuNwdTDgJEQdNl44b535b9";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${currentToken}`
        },
        body: JSON.stringify(assetPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Backend Validation Errors:", errorData);
        
        if (errorData.errors) {
          const validationErrors = Object.values(errorData.errors).flat().join("\n");
          throw new Error(validationErrors);
        }
        throw new Error(errorData.message || `Server responded with status ${response.status}`);
      }

      alert(isEditMode ? "Asset entry altered successfully!" : "New asset entry saved!");
      
      localStorage.removeItem("inventory_data");
      navigate("/inventory");

    } catch (err: any) {
      console.error("Transmission Error details:", err);
      alert(`Could not save item to backend server:\n${err.message}`);
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
            {isEditMode ? "Modify Asset Records" : "Register New IT Asset"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              {/* Asset Information */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <Package size={18} className="text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Asset Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Asset ID</label>
                    <input 
                      type="text" 
                      name="assetId"
                      value={formData.assetId}
                      onChange={handleInputChange}
                      disabled={isEditMode} 
                      placeholder="e.g. AST-2026-03" 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:bg-slate-100 disabled:text-slate-500" 
                    />
                  </div>
                  
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
                      <option value="Desktops">Desktops</option>
                      <option value="Laptops">Laptops</option>
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
                      placeholder="e.g. Assigned, Available, Maintenance, Pending, Expired, Retired" 
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
                  
                  <div className="space-y-1 md:col-span-3">
                    <label className="text-xs font-semibold text-slate-600">Serial Number</label>
                    <input 
                      type="text" 
                      name="serial_number"
                      value={formData.serial_number}
                      onChange={handleInputChange}
                      placeholder="e.g. SN123456789j2"
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Warranty & Procurement */}
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
                      name="purchased_date"
                      value={formData.purchased_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Warranty Expiration (Months)</label>
                    <input 
                      type="text" 
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      placeholder="e.g. 12" 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={goBack} className="px-5 py-2 rounded-md border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm text-xs">
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>

          {/* Photo Management Sidebar */}
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
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-md">
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