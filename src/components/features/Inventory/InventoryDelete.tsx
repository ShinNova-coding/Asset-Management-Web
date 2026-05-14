"use client"
import { RiDeleteBin4Fill } from "react-icons/ri";
type DeleteProps={
    onDelete?:()=>void
}
export default function Delete({onDelete}:DeleteProps){
return(
    <button onClick={onDelete} className="text-red transition">
    <RiDeleteBin4Fill size={20}/>
    </button>
)
}