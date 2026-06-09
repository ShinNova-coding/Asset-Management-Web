"use client"

import * as React from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  FiChevronLeft, 
  FiCalendar, 
  FiUser, 
  FiCpu, 
  FiHash, 
  FiFileText, 
  FiClock 
} from "react-icons/fi"
import type { Assignment } from "@/data/assignmentdata"
import axios from "axios"

const API_URL = "http://192.168.100.186:1010/api/assignment"

const AssignmentDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  }  
  useEffect(() => {
    const fetchRecordDetails = async () => {
     
      const stateData = location.state as { editItem?: Assignment } | null
      if (stateData?.editItem) {
        setFormData(stateData.editItem)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders())
        
        if (response.data?.success) {
          const fetchedData = Array.isArray(response.data.data) 
            ? response.data.data[0] 
            : response.data.data
            
          setFormData(fetchedData)
        } else {
          setError(response.data?.message || "Failed to locate target record.")
        }
      } catch (err: any) {
        console.error("Error reading specific assignment:", err)
        setError(`Unable to pull assignment record: ${err.response?.data?.message || err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRecordDetails()
    }
  }, [id, location.state])

  // UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500 space-y-4">
        <div className="animate-spin rounded-full h-9 w-9 border-2 border-slate-300 border-t-slate-900"></div>
        <p className="text-sm font-medium tracking-wide">Retrieving...</p>
      </div>
    )
  }

  // UI STATE HANDLING: Error Alert View
  if (error || !formData) {
    return (
      <div className="p-6 max-w-xl mx-auto mt-20 text-center space-y-6">
        <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-full">
          <FiFileText size={32} />
        </div>
        <h1 className="text-xl font-bold text-slate-900">
          {error || "Assignment Record Not Found"}
        </h1>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          The asset linkage system was unable to pull a matching log instance for ID token reference: {id}
        </p>
        <Button onClick={() => navigate("/assignment")} variant="outline" className="shadow-sm">
          Return to Manifest
        </Button>
      </div>
    )
  }

  const isActive = formData.status?.toLowerCase() === "active"

  return (
    <div className="p-6 md:p-12 min-h-screen bg-slate-50/50 text-slate-900 antialiased">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* HEADER NAVIGATION */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/assignment")}
            className="text-slate-600 hover:text-slate-900 -ml-3 gap-2 text-sm font-medium transition-colors"
          >
            <FiChevronLeft className="w-4 h-4" />
            Back to Overview
          </Button>
        </div>

        {/* HERO TITLE BLOCK */}
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Assignment Detail
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm transition-all ${
              isActive 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" 
                : "bg-slate-100 text-slate-700 border border-slate-200"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`}></span>
              {formData.status || "Unknown Status"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-slate-200/80 shadow-sm bg-white overflow-hidden rounded-xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <FiUser className="w-4 h-4 text-slate-400" />
                Employee Detail
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-tight">Employee ID</label>
                  <p className="text-base font-semibold text-slate-800 mt-0.5 font-mono text-sm">{formData.employee_id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HARDWARE SPECIFICATION CARD */}
          <Card className="border border-slate-200/80 shadow-sm bg-white overflow-hidden rounded-xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <FiCpu className="w-4 h-4 text-slate-400" />
                Hardware Allocation
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-tight">Asset Name</label>
                  <p className="text-base font-semibold text-slate-800 mt-0.5">
                    {formData.asset?.name || "Unknown Asset Unit"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-tight">Asset ID</label>
                  <div className="flex items-center gap-1.5 text-slate-700 font-mono text-xs mt-1 bg-slate-50 px-2 py-1 rounded w-max border border-slate-100">
                    <FiHash className="w-3 h-3 text-slate-400" />
                    {formData.asset_id}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LIFECYCLE CHRONOLOGY BAR */}
        <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              <FiCalendar className="w-4 h-4 text-slate-400" />
               Timeline
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              <div className="space-y-1 border-l-2 border-slate-200 pl-4">
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Assigned Date</label>
                <p className="text-sm font-semibold text-slate-700">{formData.assigned_date || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NARRATIVE INSIGHT CARD */}
        <div className="relative mt-2">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-indigo-50/20 rounded-2xl -m-2 opacity-60 blur-sm pointer-events-none" />
          <Card className="relative border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <FiClock className="w-4 h-4 text-slate-400" />
                 History Activity
              </div>
              
              <div className="pt-2">
                <p className="text-base font-normal text-slate-700 leading-relaxed tracking-wide">
                  Employee ID <span className="font-semibold text-slate-900 font-mono text-sm">{formData.employee_id}</span> was assigned to the{" "}
                  <span className="font-semibold text-slate-900">{formData.asset?.name || "hardware asset"}</span> unit.
                </p>
                {formData.note ? (
                  <div className="block mt-4 text-sm text-slate-600 bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 leading-relaxed">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">System Remarks</span>
                    &ldquo;{formData.note}&rdquo;
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic mt-3">
                    No custom remarks or contextual history details were logged for this event entry.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default AssignmentDetailPage