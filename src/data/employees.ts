import type { Employee } from "@/types/employee";

export const employees: Employee[] = Array.from(
  { length: 30 },
  (_, i) => ({
    profileImage: "https://via.placeholder.com/120",
    employee_id: `EMP${i + 1}`,
    name: `Employee ${i + 1}`,
    email: `emp${i + 1}@example.com`,
    address: "Yangon",
    position: "Software Engineer",
    status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Suspend" : "Resign",
    role: "User",
    joinedDate: "2023-01-01",
    leftDate: "-",
    phone: "+959123456789",
  })
);
