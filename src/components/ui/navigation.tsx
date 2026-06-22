// src/components/layout/Navigation.tsx
import { useState } from "react"
import { ChevronDown, LogOut } from "lucide-react" 
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem("token") 
    setOpen(false)
    navigate("/", { replace: true }) 
  }

  return (
    <nav className="sticky top-0 z-30 flex h-[50px] items-center justify-between  border-slate-400 bg-[#F3F0F7] px-2">

      {/* LEFT BLOCK */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-slate-500 hover:bg-slate-100" />
       
      </div>

      {/* RIGHT BLOCK */}
      <div className="flex items-center gap-4">

<div className="relative bg-blue-800 rounded-2xl">
  <button
    onClick={() => setOpen(!open)}
    className="flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-slate-200/50"
  >
    <img
      src="https://img.magnific.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?semt=ais_hybrid&w=740&q=80"
      alt="Admin"
      className="h-8 w-8 rounded-full border border-slate-300 object-cover"
    />
    <div className="hidden text-left sm:block">
      <p className="text-xs font-bold text-white">Admin User</p>
      
    </div>
    <ChevronDown className={`h-4 w-4 text-white transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
  </button>

  {/* DROPDOWN MENU */}
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