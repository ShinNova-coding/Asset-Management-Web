"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Delete from "./InventoryDelete"
import Edit from "./InventoryEdit"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Inventory = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Inventory>[] = [
  {
    accessorKey: "asset",
    header: "Asset ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "no",
    header: "Serial No",
  },
  {
    accessorKey: "purchase",
    header: "Purchase Date",
  },
  {
    accessorKey: "warranty",
    header: "Warranty",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "action",
    header: "Action",
    
  },
  {
  id: "actions",
  cell: ({ row }) => {
    const item = row.original

    return (
        <div className="items-center">
             <Delete
        onDelete={() => {
          console.log("Delete item:", item.id)
          
        }}
      />
            <Edit onEdit={()=>{
                console.log("Edit item:",item.id)
            }}/>
     
      </div>
    )
  },
  
}
]