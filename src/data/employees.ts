import type { Employee } from "@/types/employee";

export const employees: Employee[] = Array.from(
  { length: 30 },
  (_, i) => ({
    profileImage: "https://via.placeholder.com/120",
    employee_id: `EMP${i + 1}`,
    name: `Employee ${i + 1}`,
    email: `emp${i + 1}@example.com`,
    
    position: "Software Engineer",
    status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Suspend" : "Resign",
    role: "User",
    joined_date: "2023-01-01",
    left_date: "-",
    phone: "+959123456789",
  })
);