import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router"
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { useState } from "react"
import { BsBoxFill } from "react-icons/bs"


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    
    <div className="min-h-screen flex w-full items-center justify-center bg-gray-50 p-2">
      <Card className="w-full max-w-md min-h-[480px] flex flex-col justify-between rounded-md shadow-lg">
        
        <CardHeader className="flex flex-col items-center gap-5">
          <div className="flex items-center justify-center bg-[#0070EB] w-22 h-22 rounded-3xl">

            <BsBoxFill className="w-12 h-12 text-white"  />

</div>
          <CardTitle className="text-center font-bold text-black text-xl flex flex-col items-center">
            ITAMS
          </CardTitle>
        </CardHeader>
        
  
    
  
  

        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-6">
              
              
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-black font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  
                  placeholder="Enter your email"
                  className="bg-gray-200 h-12 rounded-sm border-none focus-visible:ring-1"
                  required
                />
              </div>

              
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-black font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password" 
                    className="bg-gray-200 h-12 rounded-sm pr-10 border-none focus-visible:ring-1" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                  >
                    {showPassword ? <LuEye size={18} /> : <LuEyeClosed size={18} />}
                  </button>
                </div>
              </div>

            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button 
              type="submit" 
                className="w-full h-12 font-bold rounded-lg" 
                onClick={() => navigate("/dashboard")}
>
                Login
            </Button>
          <a
            href="#"
            className="mx-auto inline-block text-sm underline-offset-4 text-center hover:underline text-blue-500 font-medium"
          >
            Forgot your password?
          </a>
        </CardFooter>
        
      </Card>
    </div>
  )
}

export default Login