import { RiDeleteBinLine } from "react-icons/ri";
export default function Delete({ onDelete }: { onDelete?: () => void }) {
  return (
    <button onClick={onDelete} className="text-red-600 hover:text-red-700 transition">
      <RiDeleteBinLine className="w-5 h-5" />
    </button>
  )
}