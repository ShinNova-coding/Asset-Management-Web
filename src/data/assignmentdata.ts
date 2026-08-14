export interface Asset {
  asset_id: string;
  name: string;
  serial_number: string;
  purchased_date: string;
  warranty_period: number;
  model: string;
  ram_capacity: string;
  storage: string;
  category_id: number;
  status: string;
  condition: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Assignment {
  id: number; // Primary database key
  employee_id: string;
  asset_id: string;
  note: string | null;
  status: string;
  assigned_date: string;
  returned_date: string | null;
  created_at: string;
  updated_at: string;
  asset: Asset; // Nested asset relationship from backend
  user?: {
    name?: string;
  };
}

export const assignmentData: Assignment[] = [
  {
    id: 1,
    employee_id: "EMP-001",
    asset_id: "AST-2026-001",
    note: "Laptop is damaged",
    status: "active",
    assigned_date: "2026-01-01",
    returned_date: null,
    created_at: "2026-06-03T07:06:49.000000Z",
    updated_at: "2026-06-03T07:06:49.000000Z",
    asset: {
      asset_id: "AST-2026-001",
      name: "RedmiBook Pro 15",
      serial_number: "SN62387801",
      purchased_date: "2026-06-03",
      warranty_period: 12,
      model: "2026brand",
      ram_capacity: "16 GB",
      storage: "512 GB SSD",
      category_id: 1,
      status: "assigned",
      condition: "used",
      created_at: "2026-06-03T04:58:51.000000Z",
      updated_at: "2026-06-03T07:06:49.000000Z",
      deleted_at: null
    }
  },
  {
    id: 2,
    employee_id: "EMP-002",
    asset_id: "AST-2026-002",
    note: "Device checkup passed",
    status: "returned",
    assigned_date: "2026-01-02",
    returned_date: "2026-01-16",
    created_at: "2026-06-03T07:06:49.000000Z",
    updated_at: "2026-06-03T07:06:49.000000Z",
    asset: {
      asset_id: "AST-2026-002",
      name: "MacBook Air M2",
      serial_number: "SN99283711",
      purchased_date: "2026-02-10",
      warranty_period: 24,
      model: "Apple",
      ram_capacity: "8 GB",
      storage: "256 GB SSD",
      category_id: 1,
      status: "available",
      condition: "good",
      created_at: "2026-02-10T04:58:51.000000Z",
      updated_at: "2026-06-03T07:06:49.000000Z",
      deleted_at: null
    }
  },
  {
    id: 3,
    employee_id: "EMP-003",
    asset_id: "AST-2026-003",
    note: null,
    status: "active",
    assigned_date: "2026-01-03",
    returned_date: null,
    created_at: "2026-06-03T07:06:49.000000Z",
    updated_at: "2026-06-03T07:06:49.000000Z",
    asset: {
      asset_id: "AST-2026-003",
      name: "Dell XPS 13",
      serial_number: "SN11223344",
      purchased_date: "2026-05-12",
      warranty_period: 12,
      model: "Dell",
      ram_capacity: "16 GB",
      storage: "1 TB SSD",
      category_id: 1,
      status: "assigned",
      condition: "new",
      created_at: "2026-05-12T04:58:51.000000Z",
      updated_at: "2026-06-03T07:06:49.000000Z",
      deleted_at: null
    }
  },
  {
    id: 4,
    employee_id: "EMP-004",
    asset_id: "AST-2026-004",
    note: "Screen protector applied",
    status: "returned",
    assigned_date: "2026-01-04",
    returned_date: "2026-01-18",
    created_at: "2026-06-03T07:06:49.000000Z",
    updated_at: "2026-06-03T07:06:49.000000Z",
    asset: {
      asset_id: "AST-2026-004",
      name: "iPad Pro",
      serial_number: "SN44556677",
      purchased_date: "2026-01-01",
      warranty_period: 12,
      model: "Apple",
      ram_capacity: "8 GB",
      storage: "128 GB NVMe",
      category_id: 2,
      status: "available",
      condition: "excellent",
      created_at: "2026-01-01T04:58:51.000000Z",
      updated_at: "2026-06-03T07:06:49.000000Z",
      deleted_at: null
    }
  },
  {
    id: 5,
    employee_id: "EMP-005",
    asset_id: "AST-2026-005",
    note: null,
    status: "active",
    assigned_date: "2026-01-05",
    returned_date: null,
    created_at: "2026-06-03T07:06:49.000000Z",
    updated_at: "2026-06-03T07:06:49.000000Z",
    asset: {
      asset_id: "AST-2026-005",
      name: "ThinkPad X1 Carbon",
      serial_number: "SN88990011",
      purchased_date: "2026-04-20",
      warranty_period: 36,
      model: "Lenovo",
      ram_capacity: "32 GB",
      storage: "1 TB SSD",
      category_id: 1,
      status: "assigned",
      condition: "new",
      created_at: "2026-04-20T04:58:51.000000Z",
      updated_at: "2026-06-03T07:06:49.000000Z",
      deleted_at: null
    }
  }
  // You can extend additional objects down here duplicating this structural schema format
];
