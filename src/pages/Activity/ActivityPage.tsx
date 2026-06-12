"use client"

import { useState, useEffect } from "react"

interface SystemActivityLogItem {
  id: number
  causer_id: string
  causer_name: string
  description: string
  asset_id: string
  asset_name: string
  created_at: string
}

export default function ActivityPage() {
  const [logs, setLogs] = useState<SystemActivityLogItem[]>([])
  const [message, setMessage] = useState("Loading...")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSystemLogs = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("token")

        const response = await fetch("http://192.168.100.186:1010/api/activitylogs", {
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
          const sortedLogs = (result.data || []).sort((a: SystemActivityLogItem, b: SystemActivityLogItem) => b.id - a.id)
          setLogs(sortedLogs)
          setMessage(result.message || "Activity logs retrieved successfully")
        } else {
          throw new Error(result.message || "Failed to parse system activity logs.")
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred connecting to the API.")
      } finally {
        setLoading(false)
      }
    }

    fetchSystemLogs()
  }, [])

  const getDescriptionBadge = (description: string) => {
    const normalized = description.toLowerCase()
    if (normalized === "created") return "bg-blue-50 text-blue-700 ring-blue-600/20"
    if (normalized === "updated") return "bg-green-50 text-green-700 ring-green-600/20"
    if (normalized === "deleted") return "bg-red-50 text-red-700 ring-red-600/20"
    return "bg-slate-50 text-slate-700 ring-slate-600/10"
  }

  return (
    <div className="pt-4 px-6 pb-6 space-y-6 min-h-screen bg-slate-50/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-blue-500">
             Activity 
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-48 space-y-2 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <p className="text-sm">Loading...</p>
        </div>
      ) : error ? (
        <div className="space-y-4">
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-sm flex items-center justify-between">
            <div>
              💡 <strong>Notice:</strong> Using offline view or server connection failure. (Reason: {error})
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden opacity-75">
            {renderTableStructure(logs, getDescriptionBadge)}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {renderTableStructure(logs, getDescriptionBadge)}
        </div>
      )}
    </div>
  )
}

function renderTableStructure(logs: SystemActivityLogItem[], getDescriptionBadge: (desc: string) => string) {
  const formatTimestamp = (dateString: string) => {
    if (!dateString) return { date: "N/A", time: "" }
    const dateObj = new Date(dateString)
    
    const date = dateObj.toLocaleDateString("en-GB", { timeZone: "Asia/Yangon" })
    const time = dateObj.toLocaleTimeString("en-US", { 
      timeZone: "Asia/Yangon", 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
    
    return { date, time }
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-slate-200 bg-blue-400 text-sm font-semibold text-white">
          <th className="px-6 py-4">Log ID</th>
          <th className="px-6 py-4">Action Event</th>
          <th className="px-6 py-4">Asset ID</th>
          <th className="px-6 py-4">Asset Name</th>
          <th className="px-6 py-4">Operator Info</th>
          <th className="px-6 py-4">Date</th>
          <th className="px-6 py-4">Time</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
        {logs.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-6 py-8 text-center text-slate-400 font-medium">
              No tracking logs returned from the server.
            </td>
          </tr>
        ) : (
          logs.map((row) => {
            const { date, time } = formatTimestamp(row.created_at)
            return (
              <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">#{row.id}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getDescriptionBadge(row.description)}`}>
                    {row.description}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono font-medium text-xs text-slate-600">{row.asset_id}</td>
                <td className="px-6 py-4 text-slate-900 font-medium">
                  {row.asset_name === "N/A" ? <span className="text-slate-400 italic">No Modification</span> : row.asset_name}
                </td>
                <td className="px-6 py-4 text-slate-700">
                  <div className="flex flex-col">
                    <span className="font-medium">{row.causer_name}</span>
                    <span className="text-xs text-slate-400 font-mono">{row.causer_id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs font-mono">
                  {date}
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs font-mono font-semibold">
                  {time}
                </td>
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  )
}