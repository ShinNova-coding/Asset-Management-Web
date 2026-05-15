import { RiDeleteBin4Fill } from "react-icons/ri"

export default function Delete({ onDelete }: { onDelete?: () => void }) {
  return (
    <button onClick={onDelete} className="text-red-500 hover:text-red-700 transition">
      <RiDeleteBin4Fill size={20} />
    </button>
  )
}