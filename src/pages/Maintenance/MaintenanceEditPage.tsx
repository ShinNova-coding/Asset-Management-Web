"use client"

import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CheckCircle, ClipboardList, ImageIcon, Wrench, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#A78BFA] focus:ring-2 focus:ring-[#EDE9FE]"

const getCategoryName = (item: any) => {
  const category = item?.category
  if (typeof category === "string" && category !== "-") return category

  return (
    category?.name ||
    item?.category_obj?.name ||
    item?.asset?.category?.name ||
    item?.category_name ||
    "-"
  )
}

const formatDisplayDate = (value?: string | null) => {
  if (!value) return ""

  const [datePart] = value.split("T")
  const parts = datePart.split("-")
  if (parts.length !== 3) return value

  const [year, month, day] = parts
  return `${day}-${month}-${year}`
}

export default function MaintenanceEditPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const stateItem = (location.state as { maintenance?: any } | null)?.maintenance

  const [record, setRecord] = useState<any>(stateItem || null)
  const [loading, setLoading] = useState(!stateItem)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [vendor, setVendor] = useState("")
  const [vendorPhno, setVendorPhno] = useState("")
  const [vendorAddress, setVendorAddress] = useState("")
  const [cost, setCost] = useState("")
  const [payment, setPayment] = useState("paid")
  const [duration, setDuration] = useState("")
  const [voucher, setVoucher] = useState("")

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id || stateItem) return

      try {
        setLoading(true)
        const result = await apiFetch(`/maintenance/${id}`)
        const rawRecord = result?.data ?? result ?? null
        setRecord(Array.isArray(rawRecord) ? rawRecord[0] ?? null : rawRecord)
      } catch (err) {
        console.error("Fetch maintenance edit record failed:", err)
        setRecord(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRecord()
  }, [id, stateItem])

  useEffect(() => {
    if (!record) return

    setVendor(record.vendor || "")
    setVendorPhno(record.vendor_phno || "")
    setVendorAddress(record.vendor_address || "")
    setCost(record.cost?.toString() || "")
    setPayment(record.payment || "paid")
    setDuration(record.duration?.toString() || "")
    setVoucher(record.voucher || "")
  }, [record])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setVoucher(base64String.split(",")[1] || base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!record?.id) {
      showToast("Maintenance record is missing.")
      return
    }

    try {
      const completedDate = record.completed_date || new Date().toISOString().split("T")[0]

      await apiFetch("/maintenance/edit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maintenance_id: record.id,
          completed_date: completedDate,
          vendor: vendor || null,
          vendor_phno: vendorPhno || null,
          vendor_address: vendorAddress || null,
          cost: cost ? Number(cost) : 0,
          payment: payment || "paid",
          duration: duration ? Number(duration) : 0,
          voucher: voucher || null,
        }),
      })

      showToast("Marked as Complete Successfully!")
      window.setTimeout(() => navigate("/maintenance"), 900)
    } catch (err: any) {
      console.error("Maintenance complete failed:", err)
      showToast(err?.message || "Failed to mark maintenance as complete.")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]" />
      </div>
    )
  }

  if (!record) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e9e5ff] p-6">
        <div className="rounded-xl border border-red-200 bg-white p-6 text-center text-red-600 shadow-sm">
          Maintenance record not found.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#e9e5ff] p-6 font-sans text-slate-900">
      {toastMessage && (
        <div className="fixed right-6 top-6 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-[#C4B5FD] bg-[#7C3AED] px-4 py-3 text-white shadow-xl shadow-purple-500/20">
          <CheckCircle size={16} />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-auto rounded-md p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-5xl space-y-5">
        <button
          type="button"
          onClick={() => navigate("/maintenance")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#7C3AED] transition hover:text-purple-700"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[#7C3AED]">Edit Maintenance & Mark Complete</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#7C3AED]">
                <ClipboardList size={18} />
                Maintenance Information
              </div>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Employee Name</span>
                <input type="text" value={record.user?.name || record.employee_name || ""} readOnly className={inputCls} />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Asset Code</span>
                <input type="text" value={record.asset?.asset_code || record.asset_code || ""} readOnly className={inputCls} />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Category</span>
                <input type="text" value={getCategoryName(record)} readOnly className={inputCls} />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Approver</span>
                <input
                  type="text"
                  value={typeof record.accepted_by === "object" && record.accepted_by ? record.accepted_by.name : record.approver || record.accepted_by || "-"}
                  readOnly
                  className={inputCls}
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Maintenance Date</span>
                <input type="text" value={formatDisplayDate(record.maintenance_date)} readOnly className={inputCls} />
              </label>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#7C3AED]">
                <Wrench size={18} />
                Completion Details
              </div>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Vendor Name</span>
                <input type="text" value={vendor} onChange={(event) => setVendor(event.target.value.replace(/[0-9]/g, ""))} className={`${inputCls} !bg-white`} />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Vendor Phone</span>
                <input type="tel" inputMode="numeric" maxLength={13} value={vendorPhno} onChange={(event) => setVendorPhno(event.target.value.replace(/\D/g, "").slice(0, 13))} className={`${inputCls} !bg-white`} />
              </label>

              <label className="grid gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Vendor Address</span>
                <input type="text" value={vendorAddress} onChange={(event) => setVendorAddress(event.target.value)} className={`${inputCls} !bg-white`} />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Duration (Days)</span>
                <input type="number" value={duration} onChange={(event) => setDuration(event.target.value)} className={`${inputCls} !bg-white`} />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Cost (MMK)</span>
                <input type="number" value={cost} onChange={(event) => setCost(event.target.value)} className={`${inputCls} !bg-white`} />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Payment Status</span>
                <Select value={payment} onValueChange={(value) => value && setPayment(value)}>
                  <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:border-[#A78BFA] focus-visible:ring-[#EDE9FE]">
                    <SelectValue placeholder="Select Payment Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-[#DDD6FE] bg-white shadow-lg">
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <div className="grid gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Voucher Receipt (Image)</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className={`${inputCls} !bg-white pt-1.5`} />
                {voucher && (
                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#7C3AED]">
                      <ImageIcon size={14} />
                      Preview
                    </div>
                    <img src={`data:image/jpeg;base64,${voucher}`} alt="Voucher Preview" className="max-h-56 rounded-lg border border-slate-200 object-contain" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 p-5">
              <Button type="button" variant="outline" onClick={() => navigate("/maintenance")}>Cancel</Button>
              <Button type="submit" className="bg-[#7C3AED] text-white hover:bg-purple-700">Save & Complete</Button>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}
