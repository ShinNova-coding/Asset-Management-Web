"use client"

import React from "react"
import { FaEdit } from "react-icons/fa"

interface EditProps {
  onEdit?: () => void
}

export default function Edit({ onEdit }: EditProps) {
  return (
    <button 
      type="button"
      onClick={(e) => {
       
        e.stopPropagation() 
        if (onEdit) onEdit()
      }} 
      className="text-blue-800 hover:text-blue-600 active:scale-95 transition-all p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 flex items-center justify-center shadow-xs"
      title="Edit Asset"
    >
      <FaEdit size={21} />
    </button>
  )
}