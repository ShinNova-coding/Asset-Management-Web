// src/pages/Activity/ActivityPage.tsx
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
  const [message, setMessage] = useState("Loading general activity logs...")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSystemLogs = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("token")

        // Fetching from your general activity endpoint
        const response = await fetch("http://192.168.100.185:1010/api/activitylogs", {
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
          // Sort descending by ID so latest database actions show at the top
          const sortedLogs = (result.data || []).sort((a: SystemActivityLogItem, b: SystemActivityLogItem) => b.id - a.id)
          setLogs(sortedLogs)
          setMessage(result.message || "General activity logs retrieved successfully")
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

  // Action styling highlights based on data operation descriptions
  const getDescriptionBadge = (description: string) => {
    const normalized = description.toLowerCase()
    if (normalized === "created") return "bg-green-50 text-green-700 ring-green-600/20"
    if (normalized === "updated") return "bg-blue-50 text-blue-700 ring-blue-600/20"
    if (normalized === "deleted") return "bg-red-50 text-red-700 ring-red-600/20"
    return "bg-slate-50 text-slate-700 ring-slate-600/10"
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500 font-medium">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
        Fetching general audit logs from backend server...
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">General Activity Logs</h1>
        <p className="text-sm text-slate-500">{message}</p>
      </div>

      {/* DETAILED GENERAL SYSTEM LOG TABLE */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600">
              <th className="px-6 py-4">Log ID</th>
              <th className="px-6 py-4">Action Event</th>
              <th className="px-6 py-4">Asset ID</th>
              <th className="px-6 py-4">Asset Name</th>
              <th className="px-6 py-4">Operator Info</th>
              <th className="px-6 py-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium">
                  No tracking logs returned from the server.
                </td>
              </tr>
            ) : (
              logs.map((row) => (
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
                    {row.created_at ? new Date(row.created_at).toLocaleString() : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}