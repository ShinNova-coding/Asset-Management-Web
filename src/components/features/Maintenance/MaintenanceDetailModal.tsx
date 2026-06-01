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

  vendorAddress: string
  onVendorAddressChange: (v: string) => void

  vendorPhoneNumber: string
  onVendorPhoneChange: (v: string) => void

  estimatedCost: string
  onEstimatedChange: (v: string) => void

  duration: string
  onDurationChange: (v: string) => void

  durationOptions: { value: string; label: string }[]

  onClose: () => void
  onSubmit: () => void
}

export function MaintenanceDetailModal({
  open,
  item,
  vendorName,
  onVendorChange,
  vendorAddress,
  onVendorAddressChange,
  vendorPhoneNumber,
  onVendorPhoneChange,
  estimatedCost,
  onEstimatedChange,
  duration,
  onDurationChange,
  durationOptions,
  onClose,
  onSubmit,
}: Props) {
  if (!open || !item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-gray-50 shadow-2xl border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Maintenance Details
          </h2>
          
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">

          {/* Read-only info */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-900 font-bold ">
                Employee
              </p>
              <p className="text-sm font-medium text-gray-500">
                {item["employee name"]}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-900 font-bold ">
                Asset ID
              </p>
              <p className="text-sm font-medium text-gray-500">
                {item["asset ID"]}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-900 font-bold ">
                Category
              </p>
              <p className="text-sm font-medium text-gray-500">
                {item.category}
              </p>
            </div>
          </div>

          {/* Vendor Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Vendor Name
            </label>
            <Input
              value={vendorName}
              onChange={(e) => onVendorChange(e.target.value)}
              placeholder="Enter vendor name"
              className="text-sm font-medium text-gray-500"
           /> 
          </div>
           
          {/* Vendor Address */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Vendor Address
            </label>
            <Input
              value={vendorAddress}
              onChange={(e) => onVendorAddressChange(e.target.value)}
              placeholder="Enter vendor address"
              className="text-sm font-medium text-gray-500"
            />
          </div>

          {/* Vendor Phone */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Vendor Phone Number
            </label>
            <Input
              value={vendorPhoneNumber}
              onChange={(e) => onVendorPhoneChange(e.target.value)}
              placeholder="Enter vendor phone number"
              className="text-sm font-medium text-gray-500"
            />
          </div>

          {/* Estimated Cost */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Estimated Costs
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                $
              </span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={estimatedCost}
                onChange={(e) => onEstimatedChange(e.target.value)}
                className="pl-8 text-sm font-medium text-gray-500 "
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Duration Time
            </label>

            <select
              value={duration}
              onChange={(e) => onDurationChange(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-transparent px-3 text-sm text-gray-500 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select estimated duration</option>
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>
              Submit
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default MaintenanceDetailModal