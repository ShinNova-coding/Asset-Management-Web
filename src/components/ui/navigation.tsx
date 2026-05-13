import { useState } from "react"
import { ChevronDown, LogOut, Bell } from "lucide-react"

export default function Navigation() {
  const [open, setOpen] = useState(false)

  function handleLogout() {
    console.log("logout")
  }

  return (
    <nav className="flex items-center justify-between border-b bg-white px-2 py-1">

      {/* LEFT */}
      <h1 className="text-xl font-bold text-slate-700">
        {/* Dashboard */}
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <button className="relative rounded-full p-2 transition hover:bg-slate-100">

          <Bell className="h-6 w-6 text-slate-600" />

          <span className="absolute -right-1 -top-1 flex h-2 w-2 items-center justify-center rounded-full">
        
          </span>

        </button>

        {/* PROFILE DROPDOWN */}
        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-full bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700"
          >

            {/* Avatar */}
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 font-semibold">
              <img 
                src="https://img.magnific.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?semt=ais_hybrid&w=740&q=80" 
                alt="Admin Profile" 
                className="h-5 w-5 rounded-full object-cover"
                    />
            </div>

            <span className="text-sm font-semibold">
              Admin User
            </span>

            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />

          </button>

          {/* DROPDOWN */}
          {open && (
            <>
              {/* BACKDROP */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpen(false)}
              />

              {/* MENU */}
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-100 bg-white p-1 shadow-xl">

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
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