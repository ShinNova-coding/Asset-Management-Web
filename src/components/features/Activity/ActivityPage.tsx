"use client"

import React from 'react'
import { ActivityTable } from './ActivityTable'
import { type ActivityLog } from './ActivityColumns'
import { FiClock } from 'react-icons/fi'

const mockActivities: ActivityLog[] = [
  {
    id: "ACT-001",
    action: "Active",
    assigndate: "2023-10-02", 
    returndate: "2024-03-12",
    actions: "View Details"   
  },
  {
    id: "ACT-002",
    action: "Pending",
    assigndate: "2024-01-15",
    returndate: "2024-02-20",
    actions: "Manage"
  }
]

const ActivityPage = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 p-8 space-y-6">
      <div className="flex items-center gap-3 pb-2">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shadow-xs">
          <FiClock size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Activity Logs</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
       
        <ActivityTable data={mockActivities} />
      </div>
    </div>
  )
}

export default ActivityPage