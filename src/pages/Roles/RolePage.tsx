"use client"

import { useState } from "react"
import { Plus, Shield, Pencil, Trash2 } from "lucide-react"

// Assuming you have these shadcn components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const MOCK_ROLES = [
  { id: 1, name: "Admin", permissions: "All Access", users: 3 },
  { id: 2, name: "Manager", permissions: "Inventory, Assignment", users: 5 },
  { id: 3, name: "Technician", permissions: "Maintenance", users: 8 },
]

export default function RolesPage() {
  const [roles] = useState(MOCK_ROLES)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Roles & Permissions</h2>
          <p className="text-slate-500">Manage system roles and their access levels.</p>
        </div>
        <Button className="bg-[#0070EB] hover:bg-blue-600">
          <Plus className="mr-2 h-4 w-4" /> Add New Role
        </Button>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Role List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Assigned Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    {role.name}
                  </TableCell>
                  <TableCell>{role.permissions}</TableCell>
                  <TableCell>{role.users}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}