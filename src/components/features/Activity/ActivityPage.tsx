"use client"

import React from 'react'
import { ActivityTable } from './ActivityTable'
import { type ActivityLog } from './ActivityColumns'
import { FiClock } from 'react-icons/fi'

const mockActivities: ActivityLog[] = [
  {
    id: "ACT-001",
    user: "Aung Aung",
    action: "Created",
    targetAsset: "MacBook Pro M2 (INV-9821)",
    details: "Registered new asset with 2-year warranty baseline profile",
    timestamp: "2026-05-18 09:14 AM"
  },
  {
    id: "ACT-002",
    user: "Su Su",
    action: "Updated",
    targetAsset: "Dell UltraSharp 27 (INV-3412)",
    details: "Changed current assignment state location to Main Office Floor Room 4",
    timestamp: "2026-05-18 11:30 AM"
  },
  {
    id: "ACT-003",
    user: "Admin Team",
    action: "Deleted",
    targetAsset: "iPhone 11 Pro Max (INV-0041)",
    details: "Permanently purged hardware node records from operational inventory context",
    timestamp: "2026-05-17 04:45 PM"
  },
  {
    id: "ACT-004",
    user: "Mg Mg",
    action: "Maintenance Check",
    targetAsset: "HP LaserJet Enterprise (INV-8755)",
    details: "Replaced toner cartridges and updated firmware to version 4.1.2",
    timestamp: "2026-05-16 02:20 PM"
  }
]

const ActivityPage = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 p-8 space-y-6">
      
      {/* Header Container */}
      <div className="flex items-center gap-3 pb-2">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shadow-xs">
          <FiClock size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Activity Logs</h1>
          <p className="text-xs font-medium text-slate-400">Track structural changes, data mutations, and infrastructure audits over time</p>
        </div>
      </div>

      {/* Table Mounting Layout Point */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
        <ActivityTable data={mockActivities} />
      </div>

    </div>
  )
}

export default ActivityPage