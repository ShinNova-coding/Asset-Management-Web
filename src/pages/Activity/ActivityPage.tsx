"use client"

import React from "react"
import { FiClock } from "react-icons/fi"

import { ActivityTable } from "@/components/features/Activity/ActivityTable"
import type { ActivityLog } from "@/components/features/Activity/ActivityColumns"

const mockActivities: ActivityLog[] = [
  {
    id: "ACT-1001",
    username: "John",
    category: "Laptop",
    action: "Active",
    name: "MacBook Pro",
    date: "2023-10-02",
  },
  {
    id: "ACT-1002",
    username: "Alice",
    category: "Monitor",
    action: "Pending",
    name: "Dell UltraSharp",
    date: "2023-10-05",
  },
  {
    id: "ACT-1003",
    username: "Michael",
    category: "Keyboard",
    action: "Returned",
    name: "Logitech MX Keys",
    date: "2023-10-06",
  },
  {
    id: "ACT-1004",
    username: "Sophia",
    category: "Mouse",
    action: "Active",
    name: "Razer DeathAdder",
    date: "2023-10-07",
  },
  {
    id: "ACT-1005",
    username: "Daniel",
    category: "Printer",
    action: "Pending",
    name: "HP LaserJet",
    date: "2023-10-08",
  },
  {
    id: "ACT-1006",
    username: "Emma",
    category: "Tablet",
    action: "Returned",
    name: "iPad Pro",
    date: "2023-10-09",
  },
  {
    id: "ACT-1007",
    username: "William",
    category: "Laptop",
    action: "Active",
    name: "Lenovo ThinkPad",
    date: "2023-10-10",
  },
  {
    id: "ACT-1008",
    username: "Olivia",
    category: "Projector",
    action: "Pending",
    name: "Epson X500",
    date: "2023-10-11",
  },
  {
    id: "ACT-1009",
    username: "James",
    category: "Phone",
    action: "Returned",
    name: "iPhone 15",
    date: "2023-10-12",
  },
  {
    id: "ACT-1010",
    username: "Charlotte",
    category: "Desktop",
    action: "Active",
    name: "Dell OptiPlex",
    date: "2023-10-13",
  },
]

const ActivityPage = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 p-8 space-y-6">

      {/* Page Header */}
      <div className="flex items-center gap-3 pb-2">
       

        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Activity Management
          </h1>

         
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs p-6">
        <ActivityTable data={mockActivities} />
      </div>

    </div>
  )
}

export default ActivityPage