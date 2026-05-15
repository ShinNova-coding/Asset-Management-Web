import { useState } from "react"
import { ChevronDown, LogOut, Bell } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BsFillBoxFill } from "react-icons/bs"
export default function Navigation() {
  const [open, setOpen] = useState(false)

  function handleLogout() {
    console.log("logout")
    // Add your logout logic here (e.g., clearing tokens, redirecting)
  }

  return (
    
    <nav className="flex items-center justify-between  bg-slate-50 px-6 py-3 sticky top-0 z-30 border-b border-slate-400">
      
      {/* LEFT SECTION: Sidebar Toggle & Context */}
      <div className="flex items-center gap-4">
        
        {/* Optional: Add a Breadcrumb or Page Title next to the trigger */}
        <div className="hidden h-6 w-[1px] bg-slate-200 md:block" />
         <div className="flex items-center gap-7">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0070EB] shadow-md">
                <BsFillBoxFill className="text-white  h-5 w-5"/>
              </div>

              <h1 className="text-xl font-bold tracking-wide mr-8 ml-0 text-[#0070EB]">
                ITAMS
              </h1>

            </div>
        <SidebarTrigger className="text-slate-600 ml-8 hover:bg-slate-100" />
      </div>
      <div className="hidden h-6 w-[1px] bg-slate-200 md:block" />
      {/* RIGHT SECTION: Notifications & Profile */}
      <div className="flex items-center gap-3 ml-2">

        {/* Notifications */}
        <button className="relative rounded-full p-2 transition ">
          <Bell className="h-5 w-5 text-slate-600" />
          
        </button>

        {/* PROFILE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-full bg-blue-600 px-3 py-1.5 text-white shadow-sm transition hover:bg-blue-700"
          >
            {/* Avatar */}
            <img
              src="https://img.magnific.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Admin Profile"
              className="h-7 w-7 rounded-full border border-blue-400 object-cover"
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

          {/* DROPDOWN MENU */}
          {open && (
            <>
              {/* BACKDROP: Closes menu when clicking outside */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpen(false)}
              />

              {/* MENU CONTENT */}
              <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-xl border border-slate-100 bg-white p-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                
                
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