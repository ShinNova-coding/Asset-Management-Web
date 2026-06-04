"use client"

import * as React from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FiChevronLeft } from "react-icons/fi"
import type { Assignment } from "@/data/assignmentdata"
import axios from "axios"

const API_URL = "http://192.168.18.9:1010/api/assignment"

const AssignmentDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to dynamically generate authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token") // Pull client token securely
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  }

  // Load target assignment details from the remote API
  useEffect(() => {
    const fetchRecordDetails = async () => {
      // Prioritize fast path if the state is already passed via routing transitions
      const stateData = location.state as { editItem?: Assignment } | null
      if (stateData?.editItem) {
        setFormData(stateData.editItem)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Dynamic reading call using authorization configuration
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

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-screen text-slate-500 space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        <p className="text-sm">Retrieving database assignment content...</p>
      </div>
    )
  }

  if (error || !formData) {
    return (
      <div className="p-10 max-w-4xl mx-auto space-y-4">
        <h1 className="text-xl font-bold text-red-600">
          {error || "Assignment Not Found"}
        </h1>
        <Button onClick={() => navigate("/assignment")}>
          Back to Assignment
        </Button>
      </div>
    )
  }

  return (
    <div className="p-10 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ACTION BAR */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate("/assignment")}
            className="gap-2"
          >
            <FiChevronLeft />
            Back 
          </Button>
        </div>

        {/* DETAILS PANEL */}
        <div className="bg-gray-100 p-6 rounded-xl shadow border space-y-5">
          <h1 className="text-2xl font-bold text-slate-900">
            Assignment Details Profile
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Employee ID</label>
              <p className="text-sm font-semibold text-slate-800">{formData.employee_id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Asset Name</label>
              <p className="text-sm font-semibold text-slate-800 p-2 bg-slate-200/50 rounded">
                {formData.asset?.name || "Unknown Asset Unit"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Asset ID Code</label>
              <p className="text-sm font-semibold text-slate-800">{formData.asset_id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Assigned Date</label>
              <p className="text-sm font-semibold text-slate-800">{formData.assigned_date}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Returned Date</label>
              <p className="text-sm font-semibold text-slate-800">
                {formData.returned_date ? formData.returned_date : "Currently Active"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Status Mode</label>
              <p className="text-sm font-semibold text-slate-800 capitalize">{formData.status}</p>
            </div>
          </div>
        </div>

        {/* NOTES COMPONENT BLOCK */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Internal Asset Remarks & Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.note || ""}
              disabled={true}
              placeholder="No operational evaluation text found."
              className="min-h-[120px] w-full rounded-md border border-slate-300 px-3 py-2 bg-slate-100 text-sm focus:outline-none cursor-not-allowed"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AssignmentDetailPage