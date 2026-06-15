"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Maintenance } from "@/data/maintenance"

export const columns: ColumnDef<Maintenance>[] = [
  {
    accessorKey: "employee_name", 
    header: "Employee Name",
  },
  {
    accessorKey: "asset_code",
    header: "Asset Code",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "approver",
    header: "Approver",
  },
  {
    accessorKey: "maintenance_date",
    header: "Maintenance Date",
  },
  {
    accessorKey: "completed_date",
    header: "Completed Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    // 💡 မှတ်ချက်- status badge ရဲ့ design နဲ့ cell render တာကို `MaintenanceTable.tsx` ထဲမှာ 
    // အသေးစိတ် override လုပ်ပြီး ပြင်ဆင်ထားပြီးသားဖြစ်လို့ ဒီမှာ header text ပဲ ထားပေးရုံနဲ့ လုံလောက်ပါတယ်
  },
  {
    id: "actions",
    header: "Actions",
    // 💡 မှတ်ချက်- Actions ခလုတ်တွေ (Approve check, Edit ခလုတ်, View မျက်လုံးခလုတ်) အားလုံးကို
    // `MaintenanceTable.tsx` ဘက်ကနေပဲ control လုပ်ထားတာမို့လို့ ဒီနေရာမှာ ကွက်လပ်ချန်ထားပေးရပါမယ်
  },
]