"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FaCirclePlus } from "react-icons/fa6"

export function AssignmentAssign() {
  const navigate = useNavigate()

  const goToNewPage = () => {
    
    navigate("/assignment/add")
  }

  return (
    <Button 
      onClick={goToNewPage}
      className="flex items-center gap-2 rounded-md bg-[#7C3AED] px-4 py-2 text-sm text-white hover:bg-[#A78BFA]"
    >
     <FaCirclePlus size={16} /> Assign
    </Button>
    
  )
}
 