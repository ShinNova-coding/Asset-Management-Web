"use client"
import { FaEdit } from "react-icons/fa";
type EditProps={
    onEdit?:()=>void
}
export default function Edit({onEdit}:EditProps){
    return(
<button onClick={onEdit} className="text-blue">
    <FaEdit size={20}/>
</button>
    )

}