"use client"

import * as React from "react"
import { FiDollarSign, FiCalendar, FiFileText, FiUpload, FiX, FiCheckCircle, FiArrowLeft, FiTag, FiHash, FiGrid, FiImage } from "react-icons/fi"
import { useNavigate, Link } from "react-router-dom"
import { createExpense } from "@/lib/apiService"

interface CreateExpenseFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateExpenseForm({ onSuccess, onCancel }: CreateExpenseFormProps) {
  const navigate = useNavigate()

  const [cost, setCost] = React.useState<number>(0)
  const [expenseDate, setExpenseDate] = React.useState<string>("")
  const [title, setTitle] = React.useState<string>("")
  const [expenseType, setExpenseType] = React.useState<string>("claim")
  const [voucherBase64, setVoucherBase64] = React.useState<string>("")
  const [fileName, setFileName] = React.useState<string>("")
  
  const [voucherPreview, setVoucherPreview] = React.useState<string>("")
  const [assetImagePreview, setAssetImagePreview] = React.useState<string>("")
  
  const [assetCode, setAssetCode] = React.useState<string>("")
  const [assetName, setAssetName] = React.useState<string>("")
  const [serialNumber, setSerialNumber] = React.useState<string>("")
  const [category, setCategory] = React.useState<string>("Goods")
  const [description, setDescription] = React.useState<string>("")
  const [assetImageBase64, setAssetImageBase64] = React.useState<string>("")
  const [assetImageName, setAssetImageName] = React.useState<string>("")

  const [loading, setLoading] = React.useState<boolean>(false)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  
  const [employeeName, setEmployeeName] = React.useState<string>("Unknown Employee")

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.name) {
          setEmployeeName(parsedUser.name)
        }
      } catch (err) {
        console.error("Error parsing user for name initialization:", err)
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "voucher" | "asset_image") => {
    const file = e.target.files?.[0]
    if (!file) return

    const localPreviewUrl = URL.createObjectURL(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      const base64Data = result.split(",")[1]
      
      if (type === "voucher") {
        setFileName(file.name)
        setVoucherBase64(base64Data)
        setVoucherPreview(localPreviewUrl)
      } else {
        setAssetImageName(file.name)
        setAssetImageBase64(base64Data)
        setAssetImagePreview(localPreviewUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  const removeFile = (type: "voucher" | "asset_image") => {
    if (type === "voucher") {
      if (voucherPreview) URL.revokeObjectURL(voucherPreview)
      setFileName("")
      setVoucherBase64("")
      setVoucherPreview("")
    } else {
      if (assetImagePreview) URL.revokeObjectURL(assetImagePreview)
      setAssetImageName("")
      setAssetImageBase64("")
      setAssetImagePreview("")
    }
  }

  React.useEffect(() => {
    return () => {
      if (voucherPreview) URL.revokeObjectURL(voucherPreview)
      if (assetImagePreview) URL.revokeObjectURL(assetImagePreview)
    }
  }, [voucherPreview, assetImagePreview])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const storedUser = localStorage.getItem("user")
    let userId = null

    try {
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        userId = parsedUser.id || parsedUser.users_id 
      }
    } catch (parseError) {
      console.error("Error parsing user data:", parseError)
    }

    if (!userId) {
      alert("User session not found. Please log in again.")
      return
    }

    // Common required fields validation - Description is ALWAYS required
    if (cost <= 0 || !expenseDate || !title.trim() || !description.trim()) {
      alert("Please fill all required fields correctly (Cost, Date, Title, and Description are required).")
      return
    }

    // Asset purchase specific validation
    if (expenseType === "asset_purchase") {
      if (!assetName.trim() || !assetCode.trim() || !serialNumber.trim()) {
        alert("Asset Name, Asset Code, and Serial Number are all required for asset purchases.")
        return
      }
    }

    setLoading(true)

    const payload: Record<string, any> = {
      users_id: userId,
      maintenances_id: null,
      assets_id: null,
      cost: Number(cost),
      expense_date: expenseDate, 
      title: title.trim(),
      expense_type: expenseType,
      status: "approved",
      voucher: voucherBase64 || null,
      description: description.trim(),
      // Always include asset fields - send empty strings/null for non-asset types
      asset_code: expenseType === "asset_purchase" ? (assetCode?.trim() || "") : "",
      name: expenseType === "asset_purchase" ? (assetName?.trim() || "") : "",
      category: expenseType === "asset_purchase" ? (category || "") : "",
      serial_number: expenseType === "asset_purchase" ? (serialNumber?.trim() || "") : "",
      image: expenseType === "asset_purchase" && assetImageBase64?.trim() ? assetImageBase64 : null,
    }

    try {
      await createExpense(payload)

      setToastMessage("Expense created successfully!")
      
      setTimeout(() => {
        onSuccess?.()
        navigate("/expense") 
      }, 1500)
    } catch (err: any) {
      console.error("Create Expense Error:", err)
      alert(err?.message || "Failed to create expense record. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate("/expense")
    }
  }

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"

  return (
    <div className="w-full max-w-3xl mx-auto my-6">
      <div className="mb-4">
        <Link 
          to="/expense" 
          className="inline-flex items-center text-sm font-medium text-blue-800 hover:underline"
        >
          <FiArrowLeft size={16} className="mr-2" />
          Back
        </Link>
      </div>

      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden p-8 relative">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <h2 className="text-2xl font-bold text-blue-800 tracking-tight">Create New Expense</h2>
          <p className="text-xs text-slate-400 mt-1.5">
            Creating as: <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md ml-1">{employeeName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Expense Title *</label>
            <div className="relative">
              <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                placeholder="e.g., Claim form for taxi fee"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Cost (Amount) *</label>
              <div className="relative">
                <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="1,000,000"
                  value={cost || ""}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Expense Date *</label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className={`${inputCls} cursor-pointer`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Expense Type</label>
            <select
              value={expenseType}
              onChange={(e) => setExpenseType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="claim">Claim</option>
              <option value="maintenance">Maintenance</option>
              <option value="asset_purchase">Asset_Purchase</option>
              <option value="office_supply">Office_Supply</option>
              <option value="operational">Operational</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Description *</label>
            <textarea
              placeholder="Provide a detailed description of this expense..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          {expenseType === "asset_purchase" && (
            <div className="p-6 rounded-2xl border border-blue-100 bg-blue-50/20 space-y-5 animate-fade-in">
              <h3 className="text-xs font-bold text-blue-700 uppercase tracking-widest border-b border-blue-100 pb-3">
                Asset Specifications
              </h3>
              
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700">Asset Name *</label>
                  <div className="relative">
                    <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="MacBook Pro M3"
                      value={assetName}
                      onChange={(e) => setAssetName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700">Asset Code *</label>
                  <div className="relative">
                    <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="e.g., LAP-002, LAP-003"
                      value={assetCode}
                      onChange={(e) => setAssetCode(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700">Serial Number *</label>
                  <div className="relative">
                    <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="SN-99887766"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700">Asset Category</label>
                  <div className="relative">
                    <FiGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                    >
                      <option value="Goods">Goods</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Machinery">Machinery</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700">Asset Image</label>
                {!assetImageName ? (
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-blue-200 rounded-xl bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition">
                    <div className="flex flex-col items-center justify-center py-2">
                      <FiUpload className="text-blue-400 mb-1.5" size={22} />
                      <p className="text-xs font-medium text-slate-600">Upload Asset Image</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "asset_image")} />
                  </label>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border border-blue-200 bg-blue-50/50 px-4 py-2.5 rounded-xl">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FiImage className="text-blue-500 shrink-0" size={16} />
                        <span className="text-xs font-medium text-slate-700 truncate">{assetImageName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("asset_image")}
                        className="p-1 rounded-md text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition cursor-pointer"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                    {assetImagePreview && (
                      <div className="relative w-full max-h-48 rounded-xl overflow-hidden border border-blue-100 bg-slate-100 flex justify-center items-center">
                        <img src={assetImagePreview} alt="Asset Preview" className="max-h-48 object-contain w-full" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Voucher / Receipt Attachment</label>
            {!fileName ? (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="text-slate-400 mb-2" size={26} />
                  <p className="text-xs font-semibold text-slate-600">Click to upload voucher image</p>
                  <p className="text-[11px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "voucher")} />
              </label>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50/50 px-4 py-3 rounded-xl">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FiImage className="text-emerald-500 shrink-0" size={16} />
                    <span className="text-xs font-medium text-slate-700 truncate">{fileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile("voucher")}
                    className="p-1 rounded-md text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition cursor-pointer"
                  >
                    <FiX size={16} />
                  </button>
                </div>
                {voucherPreview && (
                  <div className="relative w-full max-h-60 rounded-xl overflow-hidden border border-emerald-100 bg-slate-100 flex justify-center items-center p-1.5 shadow-inner">
                    <img src={voucherPreview} alt="Voucher Preview" className="max-h-60 object-contain rounded-lg w-full" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-800 hover:bg-blue-700 rounded-xl shadow-md disabled:bg-blue-400 transition cursor-pointer"
            >
              {loading ? "Submitting..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>

      {toastMessage && (
        <div className="absolute bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl animate-fade-in">
          <FiCheckCircle className="text-emerald-400" size={18} />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  )
}