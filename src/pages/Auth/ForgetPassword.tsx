import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
    const navigate=useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Send reset link to:", email);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Reset Your Password
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            
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
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
              onClick={()=>navigate("/reset-password")}
            >
              Send Reset Link <FaArrowRight />
            </button>

            <Link
              to="/"
              className="text-blue-500 flex items-center gap-2 justify-center"
            >
              <FaArrowLeft size={14} /> Back To Login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}