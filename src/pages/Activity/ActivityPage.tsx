"use client"

import React from 'react'
import { ActivityTable } from "@/components/features/Activity/ActivityTable"
import { FiClock } from 'react-icons/fi'
const mockActivities = [
  {
    id: "ACT-001",
    
    action: "Active",
    assigndate:"2024-05-13",
    returndate:"2025--2-22",
    actions:"View Details"
  },
   {
    id: "ACT-002",
    
    action: "Pending",
    assigndate:"2023-12-01",
    returndate:"2025-01-12",
    actions:"View Details"
  },
  {
    id: "ACT-003",
    action: "Active",
    assigndate: "2023-10-02", 
    returndate: "2024-03-12",
    actions: "View Details"   
  },
  {
    id: "ACT-004",
    action: "Returned",
    assigndate: "2024-01-15",
    returndate: "2024-02-20",
    actions: "Manage"
  },
   {
    id: "ACT-005",
    action: "Returned",
    assigndate: "2024-01-15",
    returndate: "2024-02-20",
    actions: "Manage"
  },
   {
    id: "ACT-006",
    action: "Returned",
    assigndate: "2024-01-15",
    returndate: "2024-02-20",
    actions: "Manage"
  },
   {
    id: "ACT-007",
    action: "Returned",
    assigndate: "2024-01-15",
    returndate: "2024-02-20",
    actions: "Manage"
  },
   {
    id: "ACT-008",
    action: "Returned",
    assigndate: "2024-01-15",
    returndate: "2024-02-20",
    actions: "Manage"
  },
   {
    id: "ACT-009",
    action: "Returned",
    assigndate: "2024-01-15",
    returndate: "2024-02-20",
    actions: "Manage"
  },
   {
    id: "ACT-010",
    action: "Returned",
    assigndate: "2024-01-15",
    returndate: "2024-02-20",
    actions: "Manage"
  },
  
]

const ActivityPage = () => {
  return (
    
    <div className="min-h-screen bg-slate-50/50 p-8 space-y-6">
      
      
      <div className="flex items-center gap-3 pb-2">
       
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Activity Management
          </h1>
          
        </div>
      </div>

     
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs p-6">
        
        <ActivityTable data={mockActivities} />
      </div>
      
    </div>
  )
}

export default ActivityPage