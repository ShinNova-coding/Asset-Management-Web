import { useState, useEffect, type FormEvent } from "react"
import {
  BadgeCheck,
  Briefcase,
  ChevronRight,
  LogOut,
  Mail,
  Moon,
  PanelLeft,
  Pencil,
  Search,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import { normalizeImageSource } from "@/lib/utils"

const searchItems = [
  { title: "Dashboard", path: "/dashboard", keywords: "home stats overview charts" },
  { title: "Categories", path: "/categories", keywords: "category asset type tags" },
  { title: "Add Category", path: "/categories/add", keywords: "new category create" },
  { title: "Inventory", path: "/inventory", keywords: "assets devices stock equipment" },
  { title: "Add Asset", path: "/inventory/add", keywords: "new asset create inventory" },
  { title: "Assignment", path: "/assignment", keywords: "assign assets employee user" },
  { title: "Add Assignment", path: "/assignment/add", keywords: "assign new asset employee" },
  { title: "Maintenance", path: "/maintenance", keywords: "repair service fix asset" },
  { title: "Expense", path: "/expense", keywords: "cost claim purchase payment" },
  { title: "Expense Report", path: "/expense/report", keywords: "expense dashboard report chart" },
  { title: "Create Expense", path: "/expense/createexpenseform", keywords: "new expense claim purchase" },
  { title: "Activity", path: "/activity", keywords: "logs history audit" },
  { title: "User Management", path: "/usermanagement", keywords: "users employees staff accounts" },
  { title: "Employees", path: "/employees", keywords: "users staff employee table" },
  { title: "Add Employee", path: "/add-employee", keywords: "new user staff employee account" },
  { title: "Roles", path: "/roles", keywords: "permissions access user roles" },
  { title: "Create Role", path: "/roles/create", keywords: "new role permission access" },
]

type NavUser = {
  id?: string
  employee_id?: string
  name?: string
  email?: string
  position?: string | null
  status?: string
  phone_number?: string | null
  joined_date?: string | null
  left_date?: string | null
  image?: string | null
  image_url?: string | null
  preview_url?: string | null
  roles?: Array<{ name?: string }>
  role?: string
}

export default function Navigation() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [user, setUser] = useState<NavUser | null>(null)
  const navigate = useNavigate()
  
  // Safely fallback if provider context is missing
  const sidebar = useSidebar()
  const toggleSidebar = sidebar?.toggleSidebar ?? (() => {})

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }

    const savedTheme = localStorage.getItem("theme")
    const shouldUseDarkMode =
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia?.("(prefers-color-scheme: dark)").matches)

    setDarkMode(shouldUseDarkMode)
    document.documentElement.classList.toggle("dark", shouldUseDarkMode)
  }, []);

  const roleName = user?.roles?.[0]?.name || user?.role || localStorage.getItem("user_role") || ""
  const profileImage = normalizeImageSource(user?.image || user?.preview_url || user?.image_url || null)
  const filteredSearchItems = searchTerm.trim()
    ? searchItems.filter((item) => {
        const haystack = `${item.title} ${item.path} ${item.keywords}`.toLowerCase()
        return haystack.includes(searchTerm.trim().toLowerCase())
      }).slice(0, 7)
    : []

  function goTo(path: string) {
    setSearchTerm("")
    setSettingsOpen(false)
    navigate(path)
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (filteredSearchItems[0]) {
      goTo(filteredSearchItems[0].path)
    }
  }

  function handleEditProfile() {
    const editItem = {
      id: user?.id,
      employee_id: user?.employee_id || "",
      name: user?.name || "",
      role: roleName || "employee",
      email: user?.email || "",
      position: user?.position || "",
      phone_number: user?.phone_number || "",
      joined_date: user?.joined_date || "",
      left_date: user?.left_date || "",
      status: user?.status?.toLowerCase() || "active",
      image: profileImage || "",
      password: "",
    }

    setSettingsOpen(false)
    navigate("/add-employee", { state: { editItem } })
  }

  function handleThemeToggle() {
    const nextDarkMode = !darkMode
    setDarkMode(nextDarkMode)
    localStorage.setItem("theme", nextDarkMode ? "dark" : "light")
    document.documentElement.classList.toggle("dark", nextDarkMode)
  }

  function handleLogout() {
    localStorage.removeItem("token") 
    localStorage.removeItem("user") 
    localStorage.removeItem("user_role")
    localStorage.removeItem("user_permissions")
    setSettingsOpen(false)
    navigate("/", { replace: true }) 
  }

  return (
    <nav className="sticky top-0 z-30 flex h-[50px] items-center gap-3 border-b border-slate-400 bg-[#e9e5ff] px-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex shrink-0 items-center">
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-white/60 text-[#7C3AED] shadow-sm transition hover:bg-white hover:text-violet-700 dark:bg-slate-800 dark:text-violet-300 dark:hover:bg-slate-700"
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative hidden w-[530px] max-w-[46vw] sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C3AED] dark:text-violet-300" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search pages, users, assets..."
            className="h-9 w-full rounded-md border border-violet-200 bg-white pl-9 pr-9 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-violet-50 hover:text-[#7C3AED] dark:hover:bg-slate-700 dark:hover:text-violet-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {filteredSearchItems.length > 0 && (
            <div className="absolute left-0 right-0 top-11 z-40 overflow-hidden rounded-lg border border-violet-100 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
              {filteredSearchItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => goTo(item.path)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-violet-50 hover:text-[#7C3AED] dark:text-slate-100 dark:hover:bg-slate-700 dark:hover:text-violet-300"
                >
                  <span>{item.title}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}
      </form>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex h-9 items-center gap-2 rounded-md bg-[#7C3AED] px-2.5 text-white shadow-sm transition hover:bg-violet-700"
          aria-label="Open settings"
        >
          <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white/20">
            {profileImage ? (
              <img src={profileImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <div className="hidden text-left md:block">
            <p className="text-xs font-bold text-white">{user?.name || "Admin User"}</p>
            <p className="text-[10px] uppercase text-blue-200">{roleName}</p>
          </div>
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/20 dark:bg-black/50" onClick={() => setSettingsOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-sm border-l border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#7C3AED] dark:text-violet-300">
                <Settings className="h-4 w-4" />
                Settings
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close settings"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-white p-5 dark:bg-slate-900">
              <div className="flex items-center gap-4 border-b border-slate-200 pb-5 dark:border-slate-700">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-[#7C3AED] dark:bg-slate-800 dark:text-violet-300">
                  {profileImage ? (
                    <img src={profileImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-900 dark:text-slate-100">{user?.name || "Admin User"}</p>
                  <p className="truncate text-xs uppercase text-[#7C3AED] dark:text-violet-300">{roleName || "User"}</p>
                </div>
              </div>

              <div className="space-y-3 border-b border-slate-200 py-5 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#7C3AED] dark:text-violet-300" />
                  <span className="truncate">{user?.email || "No email"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <BadgeCheck className="h-4 w-4 text-[#7C3AED] dark:text-violet-300" />
                  <span>{user?.employee_id || "No employee ID"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-[#7C3AED] dark:text-violet-300" />
                  <span>{user?.position || "No position"}</span>
                </div>
              </div>

              <div className="space-y-2 pt-5">
                <button
                  onClick={handleEditProfile}
                  className="flex w-full items-center gap-3 rounded-md border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#7C3AED] dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-violet-300"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </button>
                <div className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3 dark:border-slate-700">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {darkMode ? (
                      <Moon className="h-4 w-4 text-[#7C3AED] dark:text-violet-300" />
                    ) : (
                      <Sun className="h-4 w-4 text-[#7C3AED] dark:text-violet-300" />
                    )}
                    Dark Mode
                  </div>
                  <button
                    type="button"
                    onClick={handleThemeToggle}
                    className={`relative h-6 w-11 rounded-full transition ${
                      darkMode ? "bg-[#7C3AED]" : "bg-slate-300"
                    }`}
                    aria-pressed={darkMode}
                    aria-label="Toggle dark mode"
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                        darkMode ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-md border border-red-100 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </nav>
  )
}
