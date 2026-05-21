import { columns } from "@/components/features/Maintenance/MaintenanceColumns";
import type { Maintenance } from "@/components/features/Maintenance/MaintenanceColumns";
import { MaintenanceTable } from "@/components/features/Maintenance/MaintenanceTable";

const data: Maintenance[] = [
  {employeeId: "EMP-1",name: "Employee 1",category: "Laptop",status: "Request",actions: "Accept/Decline",},
  {employeeId: "EMP-2",name: "Employee 2",category: "Desktop",status: "Active",actions: "Accept/Decline",},
  {employeeId: "EMP-3",name: "Employee 3",category: "Monitor",status: "Return",actions: "Accept/Decline",},
  {employeeId: "EMP-4",name: "Employee 4",category: "Tablet",status: "Request",actions: "Accept/Decline",},
  {employeeId: "EMP-5",name: "Employee 5",category: "Printer",status: "Active",actions: "Accept/Decline",},

  {employeeId: "EMP-6",name: "Employee 6",category: "Desktop",status: "Active",actions: "Accept/Decline",},
  {employeeId: "EMP-7",name: "Employee 7",category: "Monitor",status: "Return",actions: "Accept/Decline",},
  {employeeId: "EMP-8",name: "Employee 8",category: "Computer",status: "Active",actions: "Accept/Decline",},
  {employeeId: "EMP-9",name: "Employee 9",category: "Laptop",status: "Request",actions: "Accept/Decline",},
  {employeeId: "EMP-10",name:"Employee 10",category: "Chair",status: "Active",actions: "Accept/Decline",},

  {employeeId: "EMP-11",name: "Employee 11",category: "Tablet",status: "Return",actions: "Accept/Decline",},
  {employeeId: "EMP-12",name: "Employee 12",category: "Desktop",status: "Active",actions: "Accept/Decline",},
  {employeeId: "EMP-13",name: "Employee 13",category: "Laptop",status: "Request",actions: "Accept/Decline",},
  {employeeId: "EMP-14",name: "Employee 14",category: "Chair",status: "Request",actions: "Accept/Decline",},
  {employeeId: "EMP-15",name: "Employee 15",category: "Printer",status: "Active",actions: "Accept/Decline",},

  {employeeId: "EMP-16",name: "Employee 16",category: "Laptop",status: "Request",actions: "Accept/Decline",},
  {employeeId: "EMP-17",name: "Employee 17",category: "Desktop",status: "Active",actions: "Accept/Decline",},
  {employeeId: "EMP-18",name: "Employee 18",category: "Monitor",status: "Return",actions: "Accept/Decline",},
  {employeeId: "EMP-19",name: "Employee 19",category: "Tablet",status: "Request",actions: "Accept/Decline",},
  {employeeId: "EMP-20",name: "Employee 20",category: "Printer",status: "Active",actions: "Accept/Decline",},

  {employeeId: "EMP-21",name: "Employee 21",category: "Monitor",status: "Active",actions: "Accept/Decline",},
  {employeeId: "EMP-22",name: "Employee 22",category: "Chair",status: "Active",actions: "Accept/Decline",},
  {employeeId: "EMP-23",name: "Employee 23",category: "Laptop",status: "Return",actions: "Accept/Decline",},
  {employeeId: "EMP-24",name: "Employee 24",category: "Computer",status: "Request",actions: "Accept/Decline",},
  {employeeId: "EMP-25",name: "Employee 25",category: "Server",status: "Return",actions: "Accept/Decline",},


  {employeeId: "EMP-26",name: "Employee 26",category: "Chair",status: "Request",actions: "Accept/Decline",},
  {employeeId: "EMP-27",name: "Employee 27",category: "Desktop",status: "Active",actions: "Accept/Decline",},
  {employeeId: "EMP-28",name: "Employee 28",category: "Printer",status: "Return",actions: "Accept/Decline",},
  {employeeId: "EMP-29",name: "Employee 29",category: "Tablet",status: "Request",actions: "Accept/Decline",},
  {employeeId: "EMP-30",name: "Employee 30",category: "Laptop",status: "Return",actions: "Accept/Decline",},];

const MaintenancePage = () => {
  return (
    <div className="p-10 space-y-6 min-h-screen bg-slate-50/30">
      
      <div className="flex items-center justify-between mb-6">
        
        {/* FIXED: close this div */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Maintenance
          </h1>
        </div>

      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <MaintenanceTable columns={columns} data={data} />
      </div>

    </div>
  );
};

export default MaintenancePage;