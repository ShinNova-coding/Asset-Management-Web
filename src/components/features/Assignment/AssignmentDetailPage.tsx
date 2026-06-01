import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { assignmentData } from "@/data/assignmentdata"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FiChevronLeft, FiSave, FiTrash2 } from "react-icons/fi"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Assignment } from "@/data/assignmentdata"

const AssignmentDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Assignment | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Load assignment data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("assignment_data")
    if (savedData) {
      try {
        const parsedData: Assignment[] = JSON.parse(savedData)
        const assignment = parsedData.find((item) => item.assetId === id)
        
        // Check if we're coming from edit action with state data
        const stateData = location.state as { editItem?: Assignment } | null
        
        if (stateData?.editItem) {
          // Use the passed edit item data
          setFormData(stateData.editItem)
          setIsEditing(true)
        } else if (assignment) {
          // Normal view mode
          setFormData(assignment)
        }
      } catch (error) {
        console.error("Error loading assignment data:", error)
      }
    }
  }, [id, location.state])

  if (!formData) {
    return (
      <div className="p-10">
        <h1 className="text-xl font-bold text-red-600">
          Assignment Not Found
        </h1>

        <Button
          className="mt-4"
          onClick={() => navigate("/assignment")}
        >
          Back to Assignment
        </Button>
      </div>
    )
  }

  const handleInputChange = (field: keyof Assignment, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleSave = () => {
    if (!formData) return
    
    const savedData = localStorage.getItem("assignment_data")
    if (savedData) {
      try {
        const parsedData: Assignment[] = JSON.parse(savedData)
        const updatedData = parsedData.map(item => 
          item.assetId === formData.assetId ? formData : item
        )
        localStorage.setItem("assignment_data", JSON.stringify(updatedData))
        setIsEditing(false)
        // Navigate back to assignment list with success message
        navigate("/assignment", { 
          state: { showMessage: true, updatedItem: formData } 
        })
      } catch (error) {
        console.error("Error saving assignment data:", error)
      }
    }
  }

  const handleDelete = () => {
    if (!formData) return
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (!formData) return
    
    // Navigate back to assignment page and let it handle the session deletion
    navigate("/assignment", { 
      state: { deleteItem: formData.assetId } 
    })
    setShowDeleteDialog(false)
  }

  return (
    <div className="p-10 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* BACK AND ACTION BUTTONS */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate("/assignment")}
            className="gap-2"
          >
            <FiChevronLeft />
            Back 
          </Button>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="default"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Assignment
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="gap-2"
                >
                  <FiTrash2 />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleSave}
                  className="gap-2"
                >
                  <FiSave />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* DETAIL/EDIT CONTENT */}
        <div className="bg-gray-100 p-6 rounded-xl shadow border space-y-5">

          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? "Edit Assignment" : "Assignment Details"}
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Employee ID</label>
              {isEditing ? (
                <Input
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange("employeeId", e.target.value)}
                />
              ) : (
                <p className="text-sm">{formData.employeeId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Employee Name</label>
              {isEditing ? (
                <Input
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange("employeeName", e.target.value)}
                />
              ) : (
                <p className="text-sm">{formData.employeeName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Asset ID</label>
              {isEditing ? (
                <Input
                  value={formData.assetId}
                  onChange={(e) => handleInputChange("assetId", e.target.value)}
                />
              ) : (
                <p className="text-sm">{formData.assetId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Assigned Date</label>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.assignedDate}
                  onChange={(e) => handleInputChange("assignedDate", e.target.value)}
                />
              ) : (
                <p className="text-sm">{formData.assignedDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Returned Date</label>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.returnedDate === "_" ? "" : formData.returnedDate}
                  onChange={(e) => handleInputChange("returnedDate", e.target.value || "_")}
                  placeholder="Leave empty if not returned"
                />
              ) : (
                <p className="text-sm">{formData.returnedDate === "_" ? "Not returned" : formData.returnedDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              {isEditing ? (
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm">{formData.status}</p>
              )}
            </div>
          </div>

        </div>

        {/* NOTE INPUT BOX */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
  value={formData.notes || ""}
  onChange={(e) =>
    setFormData((prev) =>
      prev ? { ...prev, notes: e.target.value } : null
    )
  }
  disabled={!isEditing}
  placeholder={isEditing ? "Write your notes..." : "No notes available"}
  className="min-h-[120px] w-full rounded-md border px-3 py-2 bg-gray-100 text-sm"
/>
          </CardContent>
        </Card>

        {/* DELETE CONFIRMATION DIALOG */}
        {showDeleteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-sm rounded-xl bg-gray-100 p-6 shadow-xl">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="mt-2 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <FiTrash2
                    className="text-red-600"
                    size={24}
                  />
                </div>

                <h2 className="text-lg font-semibold text-slate-800">
                  Delete Assignment
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Are you sure you want to delete this assignment?
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignmentDetailPage
