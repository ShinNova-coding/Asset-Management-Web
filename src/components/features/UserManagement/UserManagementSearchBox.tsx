import { FaSearch } from "react-icons/fa"
import { Input } from "@/components/ui/input"

export function UserManagementSearch({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  return (
   
    <div className="relative flex-1">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size={18}" />
      <Input 
        className="w-full rounded-md border border-slate-400 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        placeholder="Search..." 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
      </div>
  )
}