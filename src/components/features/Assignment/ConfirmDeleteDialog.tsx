import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDeleteDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  warningMessage?: string
}

export function ConfirmDeleteDialog({ open, onConfirm, onCancel, warningMessage }: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <div className="font-bold text-lg text-red-600">Confirm Delete</div>
        </DialogHeader>
        <div className="py-2 text-sm text-slate-700">
          {warningMessage || "Are you sure you want to delete this item? This action cannot be undone."}
        </div>
        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
