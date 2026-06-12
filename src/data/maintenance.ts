export type Maintenance = { 
  
  assetUuid: string
  "employee name": string
  "asset ID": string
  category: string
  status: "Request" | "Pending" | "In Progress" | "Complete"
  stage: "pending" | "approved" | "completed"
  remark?: string
  vendorName?: string
  estimatedCost?: string
  duration?: string
  laptopType?: string
  maintenanceDetail?: string
}

export const maintenanceData: Maintenance[] = [
  { "employee name": "Employee 1","asset Name": "Laptop 1", "asset ID":"AK-100", category: "Laptop", status: "Request", stage: "pending" },
  { "employee name": "Employee 2", "asset Name": "Desktop 1", "asset ID":"AK-101",category: "Desktop", status: "Request", stage: "pending" },
  { "employee name": "Employee 3", "asset Name": "Monitor 1", "asset ID":"AK-102",category: "Monitor", status: "Request", stage: "pending" },
  { "employee name": "Employee 4", "asset Name": "Tablet 1", "asset ID":"AK-103",category: "Tablet", status: "Request", stage: "pending" },
  { "employee name": "Employee 5", "asset Name": "Printer 1", "asset ID":"AK-104",category: "Printer", status: "Request", stage: "pending" },
  { "employee name": "Employee 6", "asset Name": "Desktop 2", "asset ID":"AK-105",category: "Desktop", status: "Request", stage: "pending" },
  { "employee name": "Employee 7", "asset Name": "Monitor 2", "asset ID":"AK-106",category: "Monitor", status: "Request", stage: "pending" },
  { "employee name": "Employee 8", "asset Name": "Computer 1", "asset ID":"AK-107",category: "Computer", status: "Request", stage: "pending" },
  { "employee name": "Employee 9", "asset Name": "Laptop 2", "asset ID":"AK-108",category: "Laptop", status: "Request", stage: "pending" },
  { "employee name": "Employee 10", "asset Name": "Chair 1", "asset ID":"AK-109",category: "Chair", status: "Request", stage: "pending" },
  { "employee name": "Employee 11", "asset Name": "Tablet 2", "asset ID":"AK-110",category: "Tablet", status: "Request", stage: "pending" },
  { "employee name": "Employee 12", "asset Name": "Desktop 3", "asset ID":"AK-111",category: "Desktop", status: "Request", stage: "pending" },
  { "employee name": "Employee 17", "asset Name": "Desktop 4", "asset ID":"AK-116",category: "Desktop", status: "Request", stage: "pending" },
  { "employee name": "Employee 18", "asset Name": "Monitor 3", "asset ID":"AK-117",category: "Monitor", status: "Request", stage: "pending" },
  { "employee name": "Employee 19", "asset Name": "Tablet 3", "asset ID":"AK-118",category: "Tablet", status: "Request", stage: "pending" },
  { "employee name": "Employee 20", "asset Name": "Printer 2", "asset ID":"AK-119",category: "Printer", status: "Request", stage: "pending" },
  { "employee name": "Employee 21", "asset Name": "Monitor 4", "asset ID":"AK-120",category: "Monitor", status: "Request", stage: "pending" },
  { "employee name": "Employee 22", "asset Name": "Chair 2", "asset ID":"AK-121",category: "Chair", status: "Request", stage: "pending" },
  { "employee name": "Employee 23", "asset Name": "Computer 2", "asset ID":"AK-122",category: "Computer", status: "Request", stage: "pending" },
  { "employee name": "Employee 24", "asset Name": "Laptop 3", "asset ID":"AK-123",category: "Laptop", status: "Request", stage: "pending" },
  { "employee name": "Employee 25", "asset Name": "Desktop 5", "asset ID":"AK-124",category: "Desktop", status: "Request", stage: "pending" },
]