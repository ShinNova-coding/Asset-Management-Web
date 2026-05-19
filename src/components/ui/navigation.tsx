// navigation.tsx

import { useState } from "react"
import { ChevronDown, LogOut, Bell } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Navigation() {
  const [open, setOpen] = useState(false)

  function handleLogout() {
    console.log("logout")
  }

  return (
    <nav className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-400 bg-blue-50 px-2">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <SidebarTrigger className="text-slate-500 hover:bg-slate-100" />

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* NOTIFICATION */}
        <button className="relative rounded-full p-2 hover:bg-slate-100 transition">
          <Bell className="h-5 w-5 text-slate-500" />
        </button>

        {/* PROFILE */}
        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-full bg-[#2F6FED] px-3 py-1.5 text-white transition hover:bg-[#1F5FE0]"
          >
            <img
              src="https://img.magnific.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Admin"
              className="h-8 w-8 rounded-full border border-blue-300 object-cover"
            />

            <span className="hidden text-sm font-semibold sm:block">
              Admin User
            </span>

            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* DROPDOWN */}
          {open && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpen(false)}
              />

              <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
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