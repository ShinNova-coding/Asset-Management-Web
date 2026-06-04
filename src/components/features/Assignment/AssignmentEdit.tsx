"use client"

import * as React from "react"
import type { Assignment } from "@/data/assignmentdata"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AssignmentEditFormProps {
  assignment: Assignment
  onSave: (updated: Assignment) => void
  onCancel: () => void
}

export default function AssignmentEdit({
  assignment,
  onSave,
  onCancel,
}: AssignmentEditFormProps) {
  // Local state tracks snake_case keys coming from your live database payload
  const [employeeId, setEmployeeId] = React.useState(assignment.employee_id || "")
  const [assetId, setAssetId] = React.useState(assignment.asset_id || "")
  const [assignedDate, setAssignedDate] = React.useState(assignment.assigned_date || "")
  const [returnedDate, setReturnedDate] = React.useState(assignment.returned_date || "")
  const [status, setStatus] = React.useState(assignment.status || "pending")
  const [note, setNote] = React.useState(assignment.note || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Constructing the payload exactly as your PUT endpoint expects it
    onSave({
      ...assignment, // Preserves internal fields like assignment.id and asset relations
      employee_id: employeeId,
      asset_id: assetId,
      assigned_date: assignedDate,
      returned_date: returnedDate || null,
      status: status,
      note: note,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-slate-50 rounded-xl border shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-2">Modify Assignment Properties</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* EMPLOYEE ID */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Employee ID</label>
          <Input
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
            required
            placeholder="e.g. EMP1002"
          />
        </div>

        {/* ASSET NAME DISPLAY (READ ONLY) */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Target Asset Name</label>
          <div className="text-sm font-semibold text-slate-800 p-2 bg-slate-200/60 border rounded-md h-9 flex items-center">
            {assignment.asset?.name || "Unknown Asset Unit"}
          </div>
        </div>

        {/* ASSET DATABASE ID LINK */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Asset ID Code</label>
          <Input
            value={assetId}
            onChange={e => setAssetId(e.target.value)}
            required
          />
        </div>

        {/* ASSIGNED DATE */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Date</label>
          <Input
            type="date"
            value={assignedDate}
            onChange={e => setAssignedDate(e.target.value)}
            required
          />
        </div>

        {/* RETURNED DATE */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Returned Date</label>
          <Input
            type="date"
            value={returnedDate}
            onChange={e => setReturnedDate(e.target.value)}
          />
        </div>

        {/* STATUS PICKER */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Status Mode</label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select assignment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* INTERNAL REMARKS AND NOTES */}
      <div className="pt-2">
        <label className="block text-xs font-semibold text-slate-600 mb-1">Internal Asset Remarks & Notes</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Provide clear remarks outlining device condition metrics..."
          className="min-h-[100px] w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
        />
      </div>

      {/* ACTION CONTROLS */}
      <div className="flex gap-2 justify-end pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          Save Changes
        </Button>
      </div>
    </form>
  )
}