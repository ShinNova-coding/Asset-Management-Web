import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { useState } from "react"
import { BsBoxFill } from "react-icons/bs"
import { apiRequest, loginUser } from "@/lib/apiService";
import { getFirstAccessiblePath } from "@/lib/routeAccess";
import { cacheProfileImage } from "@/lib/utils";

const getLoginUser = (data: any) => {
  const candidates = [
    data?.user,
    data?.data?.user,
    data?.data?.data?.user,
    data?.data?.data,
    data?.data,
  ];

  return (
    candidates.find((candidate) =>
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate) &&
      (candidate.email || candidate.name || candidate.employee_id || candidate.roles)
    ) || null
  );
};

const normalizePermissions = (permissions: any[] = []) =>
  permissions
    .map((permission) => {
      if (typeof permission === "string") return { name: permission };
      return permission?.name ? permission : null;
    })
    .filter(Boolean);

const mergePermissions = (...permissionGroups: any[][]) => {
  const permissionMap = new Map<string, any>();

  permissionGroups
    .flat()
    .forEach((permission) => {
      const normalized = normalizePermissions([permission])[0];
      if (normalized?.name) {
        permissionMap.set(normalized.name, normalized);
      }
    });

  return Array.from(permissionMap.values());
};

const getLoginToken = (data: any) =>
  data?.token || data?.data?.token || data?.data?.data?.token || "";

const getRolesFromResponse = (response: any) => {
  const roles = response?.data?.data || response?.data || response || [];
  return Array.isArray(roles) ? roles : [];
};

const normalizeRoleName = (roleName: string) =>
  String(roleName || "").trim().toLowerCase();

const getPrimaryRoleName = (user: any) => {
  const role = Array.isArray(user?.roles) ? user.roles[0] : null;
  return role?.name || user?.role?.name || user?.role || user?.role_name || "Employee";
};

const getRolePermissionsFromApi = async (roleName: string) => {
  if (!roleName) return [];

  try {
    const response = await apiRequest("/role", "GET");
    const roles = getRolesFromResponse(response);

    const matchingRole = roles.find((role: any) =>
      normalizeRoleName(role?.name) === normalizeRoleName(roleName)
    );

    return normalizePermissions(matchingRole?.permissions || []);
  } catch (error) {
    console.error("Failed to fetch role permissions:", error);
    return [];
  }
};

const getUserByIdentifier = async (identifier: string) => {
  const endpoints = [
    identifier ? `/user/id?id=${encodeURIComponent(identifier)}` : "",
    identifier ? `/user/${encodeURIComponent(identifier)}` : "",
    "/profile",
    "/me",
    "/auth/me",
    "/user/profile",
  ].filter(Boolean);

  for (const endpoint of endpoints) {
    try {
      const response = await apiRequest(endpoint, "GET");
      const user = response?.data?.data || response?.data?.user || response?.data || response?.user || response;
      if (user && typeof user === "object" && !Array.isArray(user)) return user;
    } catch {
      // Try the next profile endpoint shape.
    }
  }

  return null;
};

const mergeUserDetails = (loginUser: any, fetchedUser: any, fallbackEmail: string) => {
  const baseUser =
    loginUser && typeof loginUser === "object" && !Array.isArray(loginUser)
      ? loginUser
      : {};
  const profileUser =
    fetchedUser && typeof fetchedUser === "object" && !Array.isArray(fetchedUser)
      ? fetchedUser
      : {};

  return {
    ...baseUser,
    ...profileUser,
    roles: Array.isArray(profileUser.roles) && profileUser.roles.length > 0 ? profileUser.roles : baseUser.roles,
    permissions:
      Array.isArray(profileUser.permissions) && profileUser.permissions.length > 0
        ? profileUser.permissions
        : baseUser.permissions,
    role: profileUser.role || baseUser.role,
    role_name: profileUser.role_name || baseUser.role_name,
    email: profileUser.email || baseUser.email || fallbackEmail,
  };
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });
      if (data.success || data.status === "success") {
        const token = getLoginToken(data);
        localStorage.setItem("token", token);
        localStorage.setItem("user_email", email);

        const loggedInUser = getLoginUser(data);
        const fetchedUser = await getUserByIdentifier(
          loggedInUser?.id || loggedInUser?.employee_id || loggedInUser?.email || email
        );
        const fullLoggedInUser = mergeUserDetails(loggedInUser, fetchedUser, email);

        if (fullLoggedInUser && typeof fullLoggedInUser === "object" && !Array.isArray(fullLoggedInUser)) {
          localStorage.setItem("user", JSON.stringify(fullLoggedInUser));
          cacheProfileImage(fullLoggedInUser);
        } else {
          localStorage.setItem("user", JSON.stringify({ email }));
        }

        let exactRoleName = "Employee"; 
        let exactPermissions: any[] = []; 

        if (fullLoggedInUser) {
          const primaryRole = Array.isArray(fullLoggedInUser?.roles) ? fullLoggedInUser.roles[0] : null;
          exactRoleName = getPrimaryRoleName(fullLoggedInUser); 
          exactPermissions = normalizePermissions(primaryRole?.permissions || fullLoggedInUser.permissions || []);
          exactPermissions = mergePermissions(
            exactPermissions,
            await getRolePermissionsFromApi(exactRoleName)
          );
          
          if (exactPermissions.length === 0) {
            const normalizedRoleName = normalizeRoleName(exactRoleName);
            if (normalizedRoleName === "super-admin") {
               exactPermissions = [
                { id: 7, name: "view-assets" },
                { id: 12, name: "view-users" },
                { id: 26, name: "view-dashboard" },
                { id: 28, name: "view-assignments" },
                { id: 33, name: "view-maintenances" },
                { id: 2, name: "view-categories" },
                { id: 17, name: "view-roles" },
                { id: 49, name: "view-expenses" },
                { id: 58, name: "view-activitylogs" },
                { id: 61, name: "create-categories" },
                { id: 62, name: "update-categories" },
                { id: 63, name: "delete-categories" },
                { id: 64, name: "create-assets" },
                { id: 65, name: "update-assets" },
                { id: 66, name: "delete-assets" },
                { id: 67, name: "create-users" },
                { id: 68, name: "update-users" },
                { id: 69, name: "delete-users" },
                { id: 70, name: "create-assignments" },
                { id: 71, name: "update-assignments" },
                { id: 72, name: "delete-assignments" },
                { id: 73, name: "create-maintenances" },
                { id: 74, name: "update-maintenances" },
                { id: 75, name: "delete-maintenances" },
                { id: 76, name: "approve-maintenance-requests" },
                { id: 77, name: "cancel-maintenance-requests" },
                { id: 78, name: "create-expenses" },
                { id: 79, name: "update-expenses" },
                { id: 80, name: "delete-expenses" },
                { id: 101, name: "create-roles" },
                { id: 102, name: "update-roles" },
                { id: 103, name: "delete-roles" },
               ];
            } else if (normalizedRoleName === "admin") {
               exactPermissions = [
                { id: 2, name: "view-categories" },
                { id: 3, name: "create-categories" },
                { id: 4, name: "update-categories" },
                { id: 5, name: "delete-categories" },
                { id: 7, name: "view-assets" },
                { id: 8, name: "create-assets" },
                { id: 58, name: "view-activitylogs" },
                { id: 9, name: "update-assets" },
                { id: 10, name: "delete-assets" },
                { id: 12, name: "view-users" },
                { id: 13, name: "create-users" },
                { id: 14, name: "update-users" },
                { id: 15, name: "delete-users" },
                { id: 26, name: "view-dashboard" },
                { id: 28, name: "view-assignments" },
                { id: 29, name: "create-assignments" },
                { id: 30, name: "update-assignments" },
                { id: 31, name: "delete-assignments" },
                { id: 33, name: "view-maintenances" },
                { id: 34, name: "create-maintenances" },
                { id: 35, name: "update-maintenances" },
                { id: 36, name: "delete-maintenances" },
                { id: 37, name: "get-notifications" },
                { id: 38, name: "create-asset-requests" },
                { id: 39, name: "approve-asset-requests" },
                { id: 40, name: "cancel-asset-requests" },
                { id: 43, name: "create-maintenance-requests" },
                { id: 44, name: "approve-maintenance-requests" },
                { id: 45, name: "cancel-maintenance-requests" },
                { id: 46, name: "update-maintenance-requests" },
                { id: 48, name: "view-expenses" },
               ];
            } else if (normalizedRoleName === "hr") {
               exactPermissions = [{ id: 2, name: "view-categories" }, { id: 7, name: "view-assets" }, { id: 26, name: "view-dashboard" }, { id: 28, name: "view-assignments" }, { id: 33, name: "view-maintenances" }, { id: 37, name: "get-notifications" }];
            } else if (normalizedRoleName === "employee") {
               exactPermissions = [{ id: 2, name: "view-categories" }, { id: 2, name: "view-categories" },{ id: 33, name: "view-maintenances" }, { id: 7, name: "view-assets" }, { id: 29, name: "view-assignments" }];
            }
          }
        }

        if (exactPermissions.length === 0) {
          setError("This role has no view permission. Please edit the role and add at least one view permission.");
          return;
        }

        localStorage.setItem("user_role", exactRoleName);
        localStorage.setItem("user_permissions", JSON.stringify(exactPermissions)); 
        window.location.href = getFirstAccessiblePath(exactPermissions) || "/";
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F3FF] p-6 font-sans text-[#1E1B4B]">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(124,58,237,0.15)] border border-[#F5F3FF] min-h-[500px]">
        
        {/* Left Side: Illustration / Branding */}
        <div className="hidden lg:flex w-1/2 bg-[#F5F3FF] items-center justify-center p-12">
          <div className="text-center">
            <div 
              className="w-32 h-32 mx-auto mb-6 bg-white border-2 border-[#A78BFA] rounded-full flex items-center justify-center"
              style={{ animation: 'bounce 3s infinite ease-in-out' }}
            >
               <BsBoxFill className="w-16 h-16 text-[#7C3AED]" />
            </div>
            <h3 className="text-3xl font-bold mb-2 text-[#7C3AED] tracking-tight">ITAMS</h3>
            <p className="text-[#1E1B4B]/70 text-sm max-w-xs mx-auto">
              IT asset management system. Login to continue your secure workflow.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-[#7C3AED]">Welcome back</h2>
            <p className="text-[#1E1B4B]/70">Please enter your details to login.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}
            
            <div className="grid gap-2">
              <Label className="text-[#1E1B4B] font-medium">Email Address</Label>
              <Input 
                className="bg-[#F5F3FF] border-[#A78BFA]/30 h-12 rounded-xl focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label className="text-[#1E1B4B] font-medium">Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  className="bg-[#F5F3FF] border-[#A78BFA]/30 h-12 rounded-xl pr-10 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-4 text-[#A78BFA]">
                  {showPassword ? <LuEye size={18} /> : <LuEyeClosed size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl font-bold text-white transition-all shadow-lg shadow-[#A78BFA]/30" disabled={loading}>
              {loading ? "Logging in..." : "LogIn"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
