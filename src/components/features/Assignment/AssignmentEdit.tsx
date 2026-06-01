import * as React from "react"
import type { Assignment } from "@/data/assignmentdata"
import { Button } from "@/components/ui/button"

interface AssignmentEditFormProps extends Assignment {
  onSave: (updated: Assignment) => void
  onCancel: () => void
}

export default function AssignmentEdit({
  employeeId: initialEmployeeId,
  employeeName: initialEmployeeName,
  assetId: initialAssetId,
  assignedDate: initialAssignedDate,
  returnedDate: initialReturnedDate,
  status: initialStatus,
  actions,
  onSave,
  onCancel,
}: AssignmentEditFormProps) {
  const [employeeId, setEmployeeId] = React.useState(initialEmployeeId)
  const [employeeName, setEmployeeName] = React.useState(initialEmployeeName)
  const [assetId, setAssetId] = React.useState(initialAssetId)
  const [assignedDate, setAssignedDate] = React.useState(initialAssignedDate)
  const [returnedDate, setReturnedDate] = React.useState(initialReturnedDate)
  const [status, setStatus] = React.useState(initialStatus)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      employeeId,
      employeeName,
      assetId,
      assignedDate,
      returnedDate,
      status,
      actions: ["Edit", "Delete"],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-slate-50 rounded-xl border">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1">Employee ID</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1">Employee Name</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={employeeName}
            onChange={e => setEmployeeName(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1">Asset ID</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={assetId}
            onChange={e => setAssetId(e.target.value)}
            required
            disabled
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1">Assigned Date</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={assignedDate}
            onChange={e => setAssignedDate(e.target.value)}
            required
            type="date"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1">Returned Date</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={returnedDate}
            onChange={e => setReturnedDate(e.target.value)}
            type="date"
          />
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1">Status</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={status}
            onChange={e => setStatus(e.target.value)}
            required
          >
            <option value="Active">Active</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          Save
        </Button>
      </div>
    </form>
  )
}