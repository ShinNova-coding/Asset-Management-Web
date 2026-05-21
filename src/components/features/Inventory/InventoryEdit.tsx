"use client"

import { FaEdit } from "react-icons/fa"

interface EditProps {
  onEdit?: () => void
}

export default function Edit({ onEdit }: EditProps) {
  return (
    <button 
      onClick={(e) => {
        
        e.stopPropagation() 
        
        if (onEdit) onEdit()
      }} 
      className="text-blue-300 hover:text-blue-700 transition p-1"
      title="Edit Asset"
    >
      <FaEdit size={20} />
    </button>
  )
}