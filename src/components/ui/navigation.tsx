import { useState, useEffect, useMemo, type FormEvent } from "react"
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
import { apiFetch } from "@/lib/api"
import { cacheProfileImage, getCachedProfileImage, getImageValue, normalizeImageSource } from "@/lib/utils"

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
  profileImage?: string | null
  profile_image?: string | null
  profile_photo?: string | null
  avatar?: string | null
  avatar_url?: string | null
  photo?: string | null
  photo_url?: string | null
  image_url?: string | null
  preview_url?: string | null
  roles?: Array<{ name?: string }>
  role?: string
  media?: Array<{
    original_url?: string | null
    preview_url?: string | null
    url?: string | null
    path?: string | null
  }>
}

export default function Navigation() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [user, setUser] = useState<NavUser | null>(null)
  const [profileImage, setProfileImage] = useState("")
  const navigate = useNavigate()
  
  // Safely fallback if provider context is missing
  const sidebar = useSidebar()
  const toggleSidebar = sidebar?.toggleSidebar ?? (() => {})

  useEffect(() => {
    const applyUser = (nextUser: NavUser) => {
      const rawImage = getImageValue(nextUser) || getCachedProfileImage(nextUser)

      setUser(nextUser)
      if (rawImage) {
        setProfileImage(normalizeImageSource(rawImage))
        cacheProfileImage({ ...nextUser, image: rawImage })
      }
    }

    const isSameUser = (candidate: NavUser, current: NavUser) =>
      (!!candidate.id && !!current.id && String(candidate.id) === String(current.id)) ||
      (!!candidate.employee_id && !!current.employee_id && String(candidate.employee_id) === String(current.employee_id)) ||
      (!!candidate.email && !!current.email && candidate.email.toLowerCase() === current.email.toLowerCase())

    const refreshUserFromList = async (currentUser: NavUser) => {
      try {
        const response = await apiFetch("/user")
        const users = response?.data?.data || response?.data || response || []
        if (Array.isArray(users)) {
          const freshUser = users.find((candidate: NavUser) => isSameUser(candidate, currentUser))
          if (freshUser) {
            applyUser(freshUser)
            localStorage.setItem("user", JSON.stringify(freshUser))
            return
          }
        }
      } catch {
        // Some roles cannot view the full user list; try the single-user endpoint below.
      }

      const identifier = currentUser.id || currentUser.employee_id || currentUser.email
      const endpoints = [
        identifier ? `/user/id?id=${encodeURIComponent(identifier)}` : "",
        identifier ? `/user/${encodeURIComponent(identifier)}` : "",
        "/profile",
        "/me",
        "/auth/me",
        "/user/profile",
      ].filter(Boolean)

      for (const endpoint of endpoints) {
        try {
          const response = await apiFetch(endpoint)
          const freshUser = response?.data?.data || response?.data?.user || response?.data || response?.user || response
          if (freshUser && typeof freshUser === "object" && !Array.isArray(freshUser)) {
            applyUser(freshUser)
            localStorage.setItem("user", JSON.stringify(freshUser))
            return
          }
        } catch {
          // Try the next profile endpoint shape.
        }
      }
    }

    const applyFallbackUser = () => {
      const storedEmail = localStorage.getItem("user_email") || ""
      const storedRole = localStorage.getItem("user_role") || ""
      if (!storedEmail && !storedRole) return

      applyUser({
        email: storedEmail,
        name: storedEmail ? storedEmail.split("@")[0] : storedRole || "User",
        role: storedRole,
      })
    }

    const loadStoredUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
      try {
        const storedUser = JSON.parse(userData)
        if (storedUser && typeof storedUser === "object" && !Array.isArray(storedUser)) {
          applyUser({
            ...storedUser,
            email: storedUser.email || localStorage.getItem("user_email") || "",
            role: storedUser.role || localStorage.getItem("user_role") || "",
          })
          refreshUserFromList(storedUser).catch(() => {})
        } else {
          applyFallbackUser()
        }
      } catch {
        applyFallbackUser()
        const storedEmail = localStorage.getItem("user_email")
        if (storedEmail) {
          refreshUserFromList({ email: storedEmail }).catch(() => {})
        }
      }
      } else {
      applyFallbackUser()
      const storedEmail = localStorage.getItem("user_email")
      if (storedEmail) {
        refreshUserFromList({ email: storedEmail }).catch(() => {})
      }
      }
    }

    loadStoredUser()
    window.addEventListener("profile_updated", loadStoredUser)
    window.addEventListener("focus", loadStoredUser)

    const savedTheme = localStorage.getItem("theme")
    const shouldUseDarkMode =
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia?.("(prefers-color-scheme: dark)").matches)

    setDarkMode(shouldUseDarkMode)
    document.documentElement.classList.toggle("dark", shouldUseDarkMode)

    return () => {
      window.removeEventListener("profile_updated", loadStoredUser)
      window.removeEventListener("focus", loadStoredUser)
    }
  }, []);

  const roleName = user?.roles?.[0]?.name || user?.role || localStorage.getItem("user_role") || ""
  const positionName = user?.position && user.position !== "-" ? user.position : ""
  const filteredSearchItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return []

    const getScore = (item: (typeof searchItems)[number]) => {
      const title = item.title.toLowerCase()
      const path = item.path.toLowerCase()
      const keywords = item.keywords.toLowerCase()
      const haystack = `${title} ${path} ${keywords}`

      if (title === query) return 0
      if (title.startsWith(query)) return 1
      if (title.split(" ").some((word) => word.startsWith(query))) return 2
      if (title.includes(query)) return 3
      if (path.includes(query)) return 4
      if (query.length < 3) return Number.POSITIVE_INFINITY
      if (keywords.split(" ").some((word) => word.startsWith(query))) return 5
      if (keywords.includes(query)) return 6
      if (haystack.includes(query)) return 7

      return Number.POSITIVE_INFINITY
    }

    return searchItems
      .map((item) => ({ item, score: getScore(item) }))
      .filter(({ score }) => Number.isFinite(score))
      .sort((a, b) => a.score - b.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 7)
      .map(({ item }) => item)
  }, [searchTerm])

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
      id: user?.id || localStorage.getItem("user_id") || "",
      employee_id: user?.employee_id || localStorage.getItem("employee_id") || "",
      name: user?.name || "",
      role: roleName || "employee",
      email: user?.email || localStorage.getItem("user_email") || "",
      position: user?.position || "",
      phone_number: user?.phone_number || "",
      joined_date: user?.joined_date || "",
      left_date: user?.left_date || "",
      status: user?.status?.toLowerCase() || "active",
      image: profileImage || "",
      password: "",
    }

    setSettingsOpen(false)
    navigate("/profile/edit", { state: { editItem } })
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
    localStorage.removeItem("user_id")
    localStorage.removeItem("employee_id")
    localStorage.removeItem("user_role")
    localStorage.removeItem("user_permissions")
    setSettingsOpen(false)
    navigate("/", { replace: true }) 
  }

  return (
    <nav className="z-30 flex min-h-14 items-center gap-3 rounded-2xl border border-white/70 bg-white/85 px-4 py-2 shadow-[0_12px_35px_rgba(124,58,237,0.12)] backdrop-blur-xl dark:rounded-none dark:border-x-0 dark:border-t-0 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none dark:backdrop-blur-none">
      <div className="flex shrink-0 items-center">
        <button
          onClick={toggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-[#7C3AED] shadow-sm transition hover:bg-violet-100 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-800 dark:text-violet-300 dark:shadow-none dark:hover:bg-slate-700"
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative hidden w-full max-w-2xl sm:block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C3AED] dark:text-violet-300" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search pages, users, assets..."
            className="h-10 w-full rounded-xl border border-violet-100 bg-violet-50/60 pl-11 pr-10 text-sm text-slate-700 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:shadow-none dark:focus:border-violet-400 dark:focus:bg-slate-800 dark:focus:ring-0"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-violet-100 hover:text-[#7C3AED] dark:hover:bg-slate-700 dark:hover:text-violet-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {filteredSearchItems.length > 0 && (
            <div className="absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-xl border border-violet-100 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
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
          className="flex h-10 items-center gap-2 rounded-xl bg-[#7C3AED] px-3 text-white shadow-[0_10px_22px_rgba(124,58,237,0.28)] transition hover:bg-violet-700 dark:bg-slate-800 dark:text-violet-200 dark:shadow-none dark:hover:bg-slate-700"
          aria-label="Open settings"
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-2 ring-white/25">
            {profileImage ? (
              <img src={profileImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <div className="hidden text-left md:block">
            <p className="max-w-36 truncate text-xs font-bold text-white">{user?.name || "Admin User"}</p>
            <p className="max-w-36 truncate text-[10px] uppercase text-violet-100">{roleName}</p>
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
                  <span>{positionName || "No position"}</span>
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
