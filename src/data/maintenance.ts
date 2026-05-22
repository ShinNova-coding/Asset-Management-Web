export type Maintenance = {
  employeeId: string
  name: string
  category: string
  status: "Pending" | "In Progress" | "Complete"
  stage: "pending" | "approved" | "completed"
  remark?: string
  vendorName?: string
  estimatedCost?: string
  duration?: string
  laptopType?: string
  maintenanceDetail?: string
}

export const maintenanceData: Maintenance[] = [
  { employeeId: "EMP-1", name: "Employee 1", category: "Laptop", status: "Pending", stage: "pending" },
  { employeeId: "EMP-2", name: "Employee 2", category: "Desktop", status: "Pending", stage: "pending" },
  { employeeId: "EMP-3", name: "Employee 3", category: "Monitor", status: "Pending", stage: "pending" },
  { employeeId: "EMP-4", name: "Employee 4", category: "Tablet", status: "Pending", stage: "pending" },
  { employeeId: "EMP-5", name: "Employee 5", category: "Printer", status: "Pending", stage: "pending" },
  { employeeId: "EMP-6", name: "Employee 6", category: "Desktop", status: "Pending", stage: "pending" },
  { employeeId: "EMP-7", name: "Employee 7", category: "Monitor", status: "Pending", stage: "pending" },
  { employeeId: "EMP-8", name: "Employee 8", category: "Computer", status: "Pending", stage: "pending" },
  { employeeId: "EMP-9", name: "Employee 9", category: "Laptop", status: "Pending", stage: "pending" },
  { employeeId: "EMP-10", name: "Employee 10", category: "Chair", status: "Pending", stage: "pending" },
  { employeeId: "EMP-11", name: "Employee 11", category: "Tablet", status: "Pending", stage: "pending" },
  { employeeId: "EMP-12", name: "Employee 12", category: "Desktop", status: "Pending", stage: "pending" },
  { employeeId: "EMP-13", name: "Employee 13", category: "Laptop", status: "Pending", stage: "pending" },
  { employeeId: "EMP-14", name: "Employee 14", category: "Chair", status: "Pending", stage: "pending" },
  { employeeId: "EMP-15", name: "Employee 15", category: "Printer", status: "Pending", stage: "pending" },
  { employeeId: "EMP-16", name: "Employee 16", category: "Laptop", status: "Pending", stage: "pending" },
  { employeeId: "EMP-17", name: "Employee 17", category: "Desktop", status: "Pending", stage: "pending" },
  { employeeId: "EMP-18", name: "Employee 18", category: "Monitor", status: "Pending", stage: "pending" },
  { employeeId: "EMP-19", name: "Employee 19", category: "Tablet", status: "Pending", stage: "pending" },
  { employeeId: "EMP-20", name: "Employee 20", category: "Printer", status: "Pending", stage: "pending" },
  { employeeId: "EMP-21", name: "Employee 21", category: "Monitor", status: "Pending", stage: "pending" },
  { employeeId: "EMP-22", name: "Employee 22", category: "Chair", status: "Pending", stage: "pending" },
  { employeeId: "EMP-23", name: "Employee 23", category: "Laptop", status: "Pending", stage: "pending" },
  { employeeId: "EMP-24", name: "Employee 24", category: "Computer", status: "Pending", stage: "pending" },
  { employeeId: "EMP-25", name: "Employee 25", category: "Server", status: "Pending", stage: "pending" },
  { employeeId: "EMP-26", name: "Employee 26", category: "Chair", status: "Pending", stage: "pending" },
  { employeeId: "EMP-27", name: "Employee 27", category: "Desktop", status: "Pending", stage: "pending" },
  { employeeId: "EMP-28", name: "Employee 28", category: "Printer", status: "Pending", stage: "pending" },
  { employeeId: "EMP-29", name: "Employee 29", category: "Tablet", status: "Pending", stage: "pending" },
  { employeeId: "EMP-30", name: "Employee 30", category: "Laptop", status: "Pending", stage: "pending" },
]
