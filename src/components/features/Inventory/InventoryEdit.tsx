import { FaEdit } from "react-icons/fa"

export default function Edit({ onEdit }: { onEdit?: () => void }) {
  return (
    <button onClick={onEdit} className="text-blue-500 hover:text-blue-700 transition">
      <FaEdit size={20} />
    </button>
  )
}