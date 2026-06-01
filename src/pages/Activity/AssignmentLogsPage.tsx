
import { useState, useEffect } from "react"
import { ClipboardList, CheckCircle2, Clock, XCircle } from "lucide-react"

interface AssignmentLogItem {
  id: number
  description: string
  status: string
  asset_name: string
  action_by: string
  created_at: string
}

export default function AssignmentLogsPage() {
  const [logs, setLogs] = useState<AssignmentLogItem[]>([])
  const [message, setMessage] = useState("Loading assignment report...")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssignmentLogs = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("token")

        // Fetching from your assignment endpoint
        const response = await fetch("http://192.168.100.185:1010/api/assignmentlogs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        })

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
          setLogs(result.data || [])
          setMessage(result.message || "Assignment Activity log retrieved successfully")
        } else {
          throw new Error(result.message || "Failed to parse assignment activity logs.")
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred connecting to the API.")
      } finally {
        setLoading(false)
      }
    }

    fetchAssignmentLogs()
  }, [])

  // Dynamic metrics calculation from array data
  const totalLogs = logs.length
  const approvedCount = logs.filter(item => item.status.toLowerCase() === "approved").length
  const requestedCount = logs.filter(item => item.status.toLowerCase() === "requested").length
  const rejectedCount = logs.filter(item => item.status.toLowerCase() === "rejected").length

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500 font-medium">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
        Fetching live assignment metrics from backend server...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">
        <p className="font-semibold text-lg mb-2">Connection Error</p>
        <p className="text-sm text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition"
        >
          Try Reconnecting
        </button>
      </div>
    )
  }

  const cardItems = [
    {
      title: "Total Assignments Logged",
      value: totalLogs,
      icon: ClipboardList,
      iconBg: "bg-blue-500 text-white",
    },
    {
      title: "Approved Allocations",
      value: approvedCount,
      icon: CheckCircle2,
      iconBg: "bg-slate-50 text-green-600",
    },
    {
      title: "Pending Requests",
      value: requestedCount,
      icon: Clock,
      iconBg: "bg-slate-50 text-blue-600",
    },
    {
      title: "Rejected Requests",
      value: rejectedCount,
      icon: XCircle,
      iconBg: "bg-slate-50 text-red-600",
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assignment Logs</h1>
        <p className="text-sm text-slate-500">{message}</p>
      </div>

      {/* DASHBOARD SUMMARY CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cardItems.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500 tracking-wide">{item.title}</p>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{item.value}</h2>
            </div>
            <div className={`p-3 rounded-xl border border-slate-100 ${item.iconBg}`}>
              <item.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* STATUS BREAKDOWN MATRIX */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-sm text-slate-700">Request Pipeline Summary</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-white">
              <th className="px-6 py-3">Assignment Request State</th>
              <th className="px-6 py-3 text-right">Log Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Requested (Awaiting Review)
              </td>
              <td className="px-6 py-4 text-right font-mono font-semibold text-slate-700">{requestedCount}</td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" /> Approved & Disbursed
              </td>
              <td className="px-6 py-4 text-right font-mono font-semibold text-slate-700">{approvedCount}</td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" /> Declined Requests
              </td>
              <td className="px-6 py-4 text-right font-mono font-semibold text-slate-700">{rejectedCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}