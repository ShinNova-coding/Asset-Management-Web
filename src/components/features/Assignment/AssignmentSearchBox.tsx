import { FaSearch } from "react-icons/fa"
import { Input } from "@/components/ui/input"

export function AssignmentSearch({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  return (
   
    <div className="relative flex-1">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <Input 
        className="pl-10 w-full sm:w-150" 
        placeholder="Search by employee ID, name, asset ID..."
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  )
}