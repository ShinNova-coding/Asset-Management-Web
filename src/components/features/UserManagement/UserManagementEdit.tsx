"use client"

import { MdOutlineModeEditOutline } from "react-icons/md";

interface EditProps {
  onEdit?: () => void
}

export default function Edit({ onEdit }: EditProps) {
  return (
    <button 
      onClick={(e) => {
        // Stops the click event from triggering the TableRow's onClick navigation handler
        e.stopPropagation() 
        
        if (onEdit) onEdit()
      }} 
      className="text-[#7C3AED] hover:text-[#A78BFA] transition p-1"
      title="Edit Asset"
    >
      <MdOutlineModeEditOutline className="w-5 h-5" />
    </button>
  )
}