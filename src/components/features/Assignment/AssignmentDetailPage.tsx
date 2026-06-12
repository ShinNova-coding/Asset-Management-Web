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
        
        const response = await axios.get(`${API_URL}/assignment_id`, {
          ...getAuthHeaders(),
          params: { assignment_id: id }
        })
        
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500 space-y-4">
        <div className="animate-spin rounded-full h-9 w-9 border-2 border-slate-300 border-t-slate-900"></div>
        <p className="text-sm font-medium tracking-wide">Loading...</p>
      </div>
    )
  }

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
          Return
        </Button>
      </div>
    )
  }

  const isActive = formData.status?.toLowerCase() === "active"

  const displayUserId = formData.user?.employee_id || formData.employee_id || formData.users_id || "N/A"
  const displayUserName = formData.user?.name || formData.user_name || "Unknown User"
  
  const displayAssetCode = formData.asset?.asset_code || formData.asset_code || formData.assets_id || "N/A"
  const displayAssetName = formData.asset?.name || formData.asset_name || "Unknown Asset Unit"

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50/50 text-slate-900 antialiased">
      <div className="max-w-3xl mx-auto space-y-4">
        
        {/* HEADER NAVIGATION & TITLE BLOCK */}
        <div className="space-y-3 border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/assignment")}
              className="text-slate-600 hover:text-slate-900 -ml-3 gap-2 text-sm font-medium transition-colors h-8"
            >
              <FiChevronLeft className="w-4 h-4" />
              Back 
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Assignment Detail
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-md font-semibold tracking-wide shadow-sm transition-all ${
              isActive 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" 
                : "bg-slate-100 text-slate-700 border border-slate-200"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full  ${isActive ? "bg-emerald-500" : "bg-slate-400"}`}></span>
              {formData.status || "Unknown Status"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-slate-200/80 shadow-sm bg-white overflow-hidden rounded-lg">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-md font-bold uppercase tracking-wider text-slate-400">
                <FiUser className="w-3.5 h-3.5 text-slate-400" />
                User Detail
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-bold uppercase tracking-tight">Employee ID</label>
                  <p className="font-semibold text-slate-800  text-sm mt-0.5">{displayUserId}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-bold uppercase tracking-tight">Employee Name</label>
                  <p className="font-semibold text-slate-800 text-sm mt-0.5">{displayUserName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HARDWARE SPECIFICATION CARD */}
          <Card className="border border-slate-200/80 shadow-sm bg-white overflow-hidden rounded-lg">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-md font-bold uppercase tracking-wider text-slate-400">
                <FiCpu className="w-3.5 h-3.5 text-slate-400" />
                Hardware Allocation
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-bold uppercase tracking-tight">Asset Name</label>
                  <p className="font-semibold text-slate-800 text-sm mt-0.5">
                    {displayAssetName}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-bold uppercase tracking-tight">Asset Code</label>
                  <div className="font-semibold text-slate-800 text-sm mt-0.5  ">
                   
                    {displayAssetCode}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LIFECYCLE CHRONOLOGY BAR */}
        <Card className="border border-slate-200/80 shadow-sm bg-white rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-md font-bold uppercase tracking-wider text-slate-400 mb-2">
              <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
              Timeline
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              <div className="space-y-0.5 border-l-2 border-slate-200 pl-3">
                <label className="block text-xs font-medium uppercase tracking-wider">Assigned Date</label>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">{formData.assigned_date || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NARRATIVE INSIGHT/NOTE CARD */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-indigo-50/20 rounded-lg -m-1 opacity-60 blur-sm pointer-events-none" />
          <Card className="relative border border-slate-200 shadow-sm bg-white rounded-lg overflow-hidden">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-md font-bold uppercase tracking-wider text-slate-400">
                <FiClock className="w-3.5 h-3.5 text-slate-400" />
                Note
              </div>
              
              <div>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">
                  {formData.note || "No additional notes provided for this assignment."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default AssignmentDetailPage