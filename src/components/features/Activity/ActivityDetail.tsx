"use client"

import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  FiArrowLeft,
  FiCalendar,
  FiPackage,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiTag,
  FiFileText,
  FiCheckCircle
} from "react-icons/fi"

export default function ActivityDetail() {
  const location = useLocation()
  const navigate = useNavigate()

  const activityItem = location.state?.item

  if (!activityItem) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <FiPackage size={24} />
        </div>

        <h3 className="text-lg font-semibold text-slate-900">
          No Activity Selected
        </h3>

        <p className="text-sm text-slate-500">
          Please select an activity record from the activity table.
        </p>

        <Button
          onClick={() => navigate("/activity")}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
        >
          Return to Activity
        </Button>
      </div>
    )
  }

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"

      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200"

      case "returned":
        return "bg-blue-50 text-blue-700 border-blue-200"

      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-6 text-slate-950 font-sans">

      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/activity")}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 -ml-2"
      >
        <FiArrowLeft size={16} />
        Back to Activity
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">

        <div className="space-y-1">

          <div className="flex items-center gap-2 flex-wrap">

            <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">
              {activityItem.id}
            </span>

            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusStyles(activityItem.action)}`}
            >
              {activityItem.action || "Unknown"}
            </span>

          </div>

          

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">

            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <FiCheckCircle size={18} className="text-blue-600" />

              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Activity Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">

              <div>
                <span className="text-xs text-slate-400 block">
                  Activity ID
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {activityItem.action}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">
                  Asset ID
                </span>

                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                 
                  {activityItem.category || "N/A"}
                </span>
              </div>
               <div>
                <span className="text-xs text-slate-400 block">
                  Activity Type
                </span>

                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  
                  {activityItem.category || "N/A"}
                </span>
              </div>


            </div>
          </div>
          

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">

            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <FiCalendar size={18} className="text-blue-600" />

              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Timeline Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">

              <div>
                <span className="text-xs text-slate-400 block">
                  Assign Date
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {activityItem.assigndate || "N/A"}
                </span>
              </div>
           
              <div>
                <span className="text-xs text-slate-400 block">
                  Return Date
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {activityItem.returndate || "N/A"}
                </span>
              </div>

            </div>
          </div>

         

        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">

          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FiFileText size={18} className="text-blue-600" />

            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Activity Image
            </h2>
          </div>

          <div className="aspect-square w-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden p-2">

            {activityItem.image ? (
              <img
                src={activityItem.image}
                alt="activity"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="text-center text-slate-400">
                No Image Uploaded
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}