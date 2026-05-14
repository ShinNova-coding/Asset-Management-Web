import { Button } from "@/components/ui/button"
import { FaCirclePlus } from "react-icons/fa6";
export function InventoryAddNewAsset(){
  return(
    <div>
      <Button>
        <FaCirclePlus />Add New Asset
      </Button>
    </div>
  )
}