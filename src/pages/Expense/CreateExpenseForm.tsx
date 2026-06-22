"use client"

import * as React from "react"
import { FiDollarSign, FiCalendar, FiFileText, FiUpload, FiX, FiCheckCircle, FiChevronLeft } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "@/lib/api"

interface CreateExpenseFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateExpenseForm({ onSuccess, onCancel }: CreateExpenseFormProps) {
  const navigate = useNavigate()

  // ── FORM STATES ──────────────────────────────────────────────────
  const [cost, setCost] = React.useState<number>(0)
  const [expenseDate, setExpenseDate] = React.useState<string>("")
  const [title, setTitle] = React.useState<string>("")
  const [expenseType, setExpenseType] = React.useState<string>("claim")
  const [voucherBase64, setVoucherBase64] = React.useState<string>("")
  const [fileName, setFileName] = React.useState<string>("")
  
  const [loading, setLoading] = React.useState<boolean>(false)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  
  // UI တွင် လက်ရှိ Login ဝင်ထားသော ဝန်ထမ်းအမည်ကို ပြသရန် State
  const [employeeName, setEmployeeName] = React.useState<string>("Unknown Employee")

  // ── INITIAL EFFECT ──────────────────────────────────────────────
  React.useEffect(() => {
    // localStorage ထဲက user object ကနေ name ကို ဆွဲထုတ်ပြီး Form ခေါင်းစဉ် သို့မဟုတ် သက်ဆိုင်ရာနေရာမှာ ပြရန်
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // JSON response အရ 'name' (ဥပမာ: System Admin) ကို ရယူခြင်း
        if (parsedUser.name) {
          setEmployeeName(parsedUser.name)
        }
      } catch (err) {
        console.error("Error parsing user for name initialization:", err)
      }
    }
  }, [])

  // ── FILE TO BASE64 HANDLER ──────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      const base64Data = result.split(",")[1]
      setVoucherBase64(base64Data)
    }
    reader.readAsDataURL(file)
  }

  const removeFile = () => {
    setFileName("")
    setVoucherBase64("")
  }

  // ── SUBMIT HANDLER ───────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // LocalStorage ကနေ User ID ယူခြင်း
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

    if (cost <= 0 || !expenseDate || !title.trim()) {
      alert("Please fill all required fields correctly.")
      return
    }

    setLoading(true)

    // html input (YYYY-MM-DD) ဒေတာအတိုင်း တိုက်ရိုက် သုံးစွဲခြင်း
    const formattedDate = expenseDate; 

    const payload = {
      users_id: userId,
      cost: Number(cost),
      expense_date: formattedDate, // '2026-07-11' ပုံစံဖြင့် ရောက်သွားပါမည်
      title: title.trim(),
      expense_type: expenseType,
      status: "approved",
      voucher: voucherBase64 || null,
    }

    try {
      await apiFetch("/expense", { 
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "*/*",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify(payload),
      })

      setToastMessage("Expense created successfully!")
      
      setTimeout(() => {
        onSuccess?.()
        navigate("/expense") 
      }, 1500)
    } catch (err: any) {
      console.error("Create Expense Error:", err)
      alert(err?.message || "Failed to create expense record.")
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
    "w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 relative">
      
      {/* HEADER WITH BACK BUTTON */}
      <div className="border-b border-slate-100 pb-4 mb-5 flex items-center justify-between">
        <div>
          <button 
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-2"
          >
            <FiChevronLeft size={16} /> Back to Expenses
          </button>
          <h2 className="text-xl font-bold text-slate-900">Create New Expense</h2>
          {/* ID ရှည်ကြီးတွေအစား လက်ရှိဖောင်တင်နေတဲ့ ဝန်ထမ်းအမည်ကို ရှင်းရှင်းလင်းလင်းပြသပေးခြင်း */}
          <p className="text-xs text-slate-400 mt-1">Creating as: <span className="font-semibold text-blue-600">{employeeName}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-700">Expense Title *</label>
          <div className="relative">
            <FiFileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
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

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Cost Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-700">Cost (Amount) *</label>
            <div className="relative">
              <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="number"
                required
                min="1"
                placeholder="1000000"
                value={cost || ""}
                onChange={(e) => setCost(Number(e.target.value))}
                className={inputCls}
              />
            </div>
          </div>

          {/* Expense Date Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-700">Expense Date *</label>
            <div className="relative">
              <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
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

        {/* Expense Type Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-700">Expense Type</label>
          <select
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="claim">Claim</option>
            <option value="maintenance">Maintenance</option>
            <option value="asset_purchase">Asset_Purchase</option>
            <option value="office_supply">Office_Supply</option>
            <option value="operational">Operational</option>
          </select>
        </div>

        {/* Voucher Upload Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-700">Voucher / Receipt Attachment</label>
          {!fileName ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="text-slate-400 mb-2" size={24} />
                <p className="text-xs font-medium text-slate-500">Click to upload voucher image</p>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50/50 px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2 overflow-hidden">
                <FiFileText className="text-emerald-500 shrink-0" size={16} />
                <span className="text-xs font-medium text-slate-700 truncate">{fileName}</span>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 rounded-md text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition"
              >
                <FiX size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Form Action Buttons */}
        <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md disabled:bg-blue-400 transition"
          >
            {loading ? "Submitting..." : "Save Expense"}
          </button>
        </div>
      </form>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="absolute bottom-4 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg animate-fade-in">
          <FiCheckCircle className="text-emerald-400" size={16} />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  )
}