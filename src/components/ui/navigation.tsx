import { useState, useEffect } from "react"
import { ChevronDown, LogOut, PanelLeft } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const navigate = useNavigate()
  
  // Safely fallback if provider context is missing
  const sidebar = useSidebar()
  const toggleSidebar = sidebar?.toggleSidebar ?? (() => {})

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token") 
    localStorage.removeItem("user") 
    setOpen(false)
    navigate("/", { replace: true }) 
  }

  return (
    <nav className="sticky top-0 z-30 flex h-[50px] items-center justify-between border-b border-slate-400 bg-[#e9e5ff] px-3">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-white/60 text-[#7C3AED] shadow-sm transition hover:bg-white hover:text-violet-700"
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative bg-[#7C3AED] rounded-xl">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-violet-600"
          >
            <div className="hidden text-left sm:block">
              <p className="text-xs font-bold text-white">{user?.name || "Admin User"}</p>
              <p className="text-[10px] text-blue-200 uppercase">{user?.role || ""}</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-white transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}