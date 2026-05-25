"use client"

import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  FiArrowLeft,
  FiMonitor,
  FiCalendar,
  FiPackage,
  FiTool,
  FiUserPlus,
  FiArchive,
  FiFileText
} from "react-icons/fi"

// Interface for type safety on dynamic timeline events
interface TimelineEvent {
  title: string
  description: string
  date: string
  actionType: string
}

export default function ActivityDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<"all" | "critical">("all")

  // Get the selected item row from the router state safely
  const activityItem = location.state?.item || {
    id: "ACT-1001",
    action: "Active",
    category: "Laptop",
    name: "MacBook Pro 16\" (2023)",
    date: "Oct 24, 2024",
    image: ""
  }

  // Dynamic Icon & Style picker based on the event's action type
  const getTimelineStyles = (action: string) => {
    switch (action?.toLowerCase()) {
      case "active":
      case "procured":
      case "asset procurement":
        return { component: FiPackage, bg: "bg-blue-50", text: "text-blue-600" }
      case "assigned":
      case "pending":
        return { component: FiUserPlus, bg: "bg-indigo-50", text: "text-indigo-600" }
      case "maintenance":
      case "repair":
      case "battery replacement":
      case "hardware fix":
        return { component: FiTool, bg: "bg-red-50", text: "text-red-500" }
      default:
        return { component: FiArchive, bg: "bg-slate-100", text: "text-slate-600" }
    }
  }

  // DYNAMIC TIMELINE GENERATION: 
  const timelineEvents: TimelineEvent[] = location.state?.history || [
    {
      title: activityItem.action || "Activity Log Entry",
      description: `Asset state updated to ${activityItem.action}. Process completed successfully under log reference tracking loops.`,
      date: activityItem.date || "Current",
      actionType: activityItem.action
    },
    {
      title: `Assigned to ${activityItem.username || "Staff User"}`,
      description: `Asset deployment control assigned to ${activityItem.username || "designated personnel"} for standard operations.`,
      date: "Oct 10, 2024",
      actionType: "assigned"
    },
    {
      title: "Asset Procured",
      description: `Initial warehouse intake registry completed for ${activityItem.name || "this unit"}.`,
      date: "Sep 28, 2024",
      actionType: "procured"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Top Navbar Header */}
      <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/activity")}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 border border-slate-200 bg-white rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Logs
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Asset Identity Banner */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <FiMonitor className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {activityItem.name || "Asset Unit"}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                ID: <span className="font-mono text-slate-700 font-semibold uppercase">{activityItem.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              {activityItem.action || "Active"}
            </span>
          </div>
        </section>

        {/* Timeline Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Dynamic Timeline Body */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Activity History</h2>
            </div>

            {/* Dynamic Timeline Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="relative border-l-2 border-slate-100 ml-4 pl-10 space-y-10">
                
                {timelineEvents.map((event, index) => {
                  const styles = getTimelineStyles(event.actionType)
                  const Icon = styles.component

                  return (
                    <div key={index} className="relative">
                      {/* Dynamic Icon Node */}
                      <div className={`absolute -left-[61px] top-0 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${styles.bg}`}>
                        <Icon className={`w-4 h-4 ${styles.text}`} />
                      </div>
                      
                      {/* Dynamic Text Content */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-900 text-base capitalize">
                            {event.title}
                          </h3>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                        <time className="text-xs font-bold text-slate-400 whitespace-nowrap pt-1 flex items-center gap-1">
                          <FiCalendar /> {event.date}
                        </time>
                      </div>
                    </div>
                  )
                })}

              </div>
            </div>
          </div>

          {/* Right Image/Receipt Evidence Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Activity Evidence</h2>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <FiFileText className="text-blue-600" size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Uploaded Document
                </h3>
              </div>

              <div className="aspect-square w-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden p-2">
                {activityItem.image ? (
                  <img
                    src={activityItem.image}
                    alt="activity evidence"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="text-center text-sm text-slate-400 p-4">
                    No document attachment image uploaded
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}