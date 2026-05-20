import type { Employee } from "@/types/employee";

export const employees: Employee[] = Array.from(
  { length: 30 },
  (_, i) => ({
    profileImage: "https://via.placeholder.com/120",
    employeeId: `EMP${i + 1}`,
    name: `Employee ${i + 1}`,
    email: `emp${i + 1}@example.com`,
    address: "Yangon, Myanmar",
    position: "Software Engineer",
    status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Suspend" : "Resign",
    role: "User",
    joiningDate: "2023-01-01",
    startDate: "2023-01-15",
    endDate: "-",
    phone: "+959123456789",
  })
);