import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router"
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { useState } from "react"
import { BsBoxFill } from "react-icons/bs"
import { loginUser } from "@/lib/apiService";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
      if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

        let exactRoleName = "Employee"; 
        let exactPermissions = []; 

        if (data.user?.roles?.length > 0) {
          exactRoleName = data.user.roles[0].name; 
          exactPermissions = data.user.roles[0].permissions || [];
          
          if (exactPermissions.length === 0) {
            if (exactRoleName === "super-admin") {
               exactPermissions = [{ id: 7, name: "view-assets" }, { id: 12, name: "view-users" }, { id: 26, name: "view-dashboard" }, { id: 28, name: "view-assignments" }, { id: 33, name: "view-maintenances" },{ id: 2, name: "view-categories" }, { id: 17, name: "view-roles" }, { id: 49, name: "view-expenses" }, { id: 58, name: "view-activitylogs" }];
            } else if (exactRoleName === "Admin") {
               exactPermissions = [{ id: 7, name: "view-assets" }, { id: 12, name: "view-users" }, { id: 26, name: "view-dashboard" }, { id: 28, name: "view-assignments" }, { id: 2, name: "view-categories" }, { id: 33, name: "view-maintenances" }];
            } else if (exactRoleName === "HR") {
               exactPermissions = [{ id: 2, name: "view-categories" }, { id: 7, name: "view-assets" }, { id: 26, name: "view-dashboard" }, { id: 28, name: "view-assignments" }, { id: 33, name: "view-maintenances" }, { id: 37, name: "get-notifications" }];
            } else if (exactRoleName === "Employee") {
               exactPermissions = [{ id: 2, name: "view-categories" }, { id: 2, name: "view-categories" },{ id: 33, name: "view-maintenances" }, { id: 7, name: "view-assets" }, { id: 29, name: "view-assignments" }];
            }
          }
        }

        localStorage.setItem("user_role", exactRoleName);
        localStorage.setItem("user_permissions", JSON.stringify(exactPermissions)); 
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      setError("Something went wrong. Cannot connect to server.");
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