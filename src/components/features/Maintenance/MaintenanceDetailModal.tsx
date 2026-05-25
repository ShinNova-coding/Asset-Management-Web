"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Maintenance } from "@/data/maintenance"

type Props = {
  open: boolean
  item?: Maintenance | null
  vendorName: string
  onVendorChange: (v: string) => void
  estimatedCost: string
  onEstimatedChange: (v: string) => void
  duration: string
  onDurationChange: (v: string) => void
  durationOptions: { value: string; label: string }[]
  laptopType: string
  onLaptopChange: (v: string) => void
  onClose: () => void
  onSubmit: () => void
}

export function MaintenanceDetailModal({
  open,
  item,
  vendorName,
  onVendorChange,
  estimatedCost,
  onEstimatedChange,
  duration,
  onDurationChange,
  durationOptions,
  laptopType,
  onLaptopChange,
  onClose,
  onSubmit,
}: Props) {
  if (!open || !item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Maintenance Details</h2>
          <p className="text-sm text-slate-500 mt-1">Provide the maintenance details to complete the job.</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Employee</p>
              <p className="text-sm font-medium text-slate-900">{item.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Category</p>
              <p className="text-sm font-medium text-slate-900">{item.category}</p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Vendor Name</label>
            <Input value={vendorName} onChange={(e) => onVendorChange(e.target.value)} placeholder="Enter service provider name" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Estimated Costs</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
              <Input type="number" min="0" step="0.01" value={estimatedCost} onChange={(e) => onEstimatedChange(e.target.value)} className="pl-8" placeholder="0.00" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Duration Time</label>
            <select value={duration} onChange={(e) => onDurationChange(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
              <option value="">Select estimated duration</option>
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Laptop&apos;s Type</label>
            <Input value={laptopType} onChange={(e) => onLaptopChange(e.target.value)} placeholder="e.g. MacBook Pro, ThinkPad X1" />
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceDetailModal
