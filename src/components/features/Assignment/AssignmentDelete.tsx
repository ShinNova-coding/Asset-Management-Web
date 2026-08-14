import { RiDeleteBin4Fill } from "react-icons/ri"

export default function Delete({ onDelete }: { onDelete?: () => void }) {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onDelete?.();
      }} 
      className="text-red-600 hover:text-red-700 transition p-1"
      title="Delete Asset"
    >
      <RiDeleteBin4Fill size={21} />
    </button>
  )
}
