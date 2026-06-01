export type Maintenance = { 
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
  { "employee name": "Employee 1",  "asset ID":"AK-100", category: "Laptop", status: "Request", stage: "pending" },
  { "employee name": "Employee 2",  "asset ID":"AK-101",category: "Desktop", status: "Request", stage: "pending" },
  { "employee name": "Employee 3",  "asset ID":"AK-102",category: "Monitor", status: "Request", stage: "pending" },
  { "employee name": "Employee 4",  "asset ID":"AK-103",category: "Tablet", status: "Request", stage: "pending" },
  { "employee name": "Employee 5",  "asset ID":"AK-104",category: "Printer", status: "Request", stage: "pending" },
  { "employee name": "Employee 6",  "asset ID":"AK-105",category: "Desktop", status: "Request", stage: "pending" },
  { "employee name": "Employee 7",  "asset ID":"AK-106",category: "Monitor", status: "Request", stage: "pending" },
  { "employee name": "Employee 8",  "asset ID":"AK-107",category: "Computer", status: "Request", stage: "pending" },
  { "employee name": "Employee 9",  "asset ID":"AK-108",category: "Laptop", status: "Request", stage: "pending" },
  { "employee name": "Employee 10", "asset ID":"AK-109",category: "Chair", status: "Request", stage: "pending" },
  { "employee name": "Employee 11", "asset ID":"AK-110",category: "Tablet", status: "Request", stage: "pending" },
  { "employee name": "Employee 12", "asset ID":"AK-111",category: "Desktop", status: "Request", stage: "pending" },
  { "employee name": "Employee 13", "asset ID":"AK-112",category: "Laptop", status: "Request", stage: "pending" },
  { "employee name": "Employee 14", "asset ID":"AK-113",category: "Chair", status: "Request", stage: "pending" },
  { "employee name": "Employee 15", "asset ID":"AK-114",category: "Printer", status: "Request", stage: "pending" },
  { "employee name": "Employee 16", "asset ID":"AK-115",category: "Laptop", status: "Request", stage: "pending" },
  { "employee name": "Employee 17", "asset ID":"AK-116",category: "Desktop", status: "Request", stage: "pending" },
  { "employee name": "Employee 18", "asset ID":"AK-117",category: "Monitor", status: "Request", stage: "pending" },
  { "employee name": "Employee 19", "asset ID":"AK-118",category: "Tablet", status: "Request", stage: "pending" },
  { "employee name": "Employee 20", "asset ID":"AK-119",category: "Printer", status: "Request", stage: "pending" },
  { "employee name": "Employee 21", "asset ID":"AK-120",category: "Monitor", status: "Request", stage: "pending" },
  { "employee name": "Employee 22", "asset ID":"AK-121",category: "Chair", status: "Request", stage: "pending" },
  { "employee name": "Employee 23", "asset ID":"AK-122",category: "Laptop", status: "Request", stage: "pending" },
  { "employee name": "Employee 24", "asset ID":"AK-123",category: "Computer", status: "Request", stage: "pending" },
  { "employee name": "Employee 25", "asset ID":"AK-124",category: "Server", status: "Request", stage: "pending" },
  { "employee name": "Employee 26", "asset ID":"AK-125",category: "Chair", status: "Request", stage: "pending" },
  { "employee name": "Employee 27", "asset ID":"AK-126",category: "Desktop", status: "Request", stage: "pending" },
  { "employee name": "Employee 28", "asset ID":"AK-127",category: "Printer", status: "Request", stage: "pending" },
  { "employee name": "Employee 29", "asset ID":"AK-128",category: "Tablet", status: "Request", stage: "pending" },
  { "employee name": "Employee 30", "asset ID":"AK-129",category: "Laptop", status: "Request", stage: "pending" },
]