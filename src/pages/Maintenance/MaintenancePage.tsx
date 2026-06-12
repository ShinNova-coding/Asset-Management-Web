import { MaintenanceTable } from "@/components/features/Maintenance/MaintenanceTable"

const MaintenancePage = () => {
  return (
    <div className="p-10 space-y-6 min-h-screen bg-slate-50/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Maintenance
          </h1>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <MaintenanceTable />
      </div>
    </div>
  )
}

export default MaintenancePage