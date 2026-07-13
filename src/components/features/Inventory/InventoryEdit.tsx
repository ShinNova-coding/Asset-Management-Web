"use client"

import React from "react"
import { MdOutlineModeEditOutline } from "react-icons/md";

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
      className="text-blue-800 hover:text-blue-900 active:scale-95 transition-all p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 flex items-center justify-center shadow-xs"
      title="Edit Asset"
    >
      <MdOutlineModeEditOutline className="text-[#7C3AED] h-5 w-5" />
    </button>
  )
}