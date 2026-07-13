import type { Employee } from "../../../types/employee";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
type Props = {
  data?: Employee;
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="group">
    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1.5 block">
      {label}
    </label>
    <div className="bg-slate-50/50 border border-slate-100 group-hover:border-violet-200 transition-colors rounded-lg px-4 py-3 text-slate-700 font-medium shadow-sm">
      {value || "-"}
    </div>
  </div>
);

export default function ViewDetailsForm({ data }: Props) {
  const navigate=useNavigate();
  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400 animate-pulse">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e9e5ff] p-4 md:p-8">
       <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/employees")} 
          className="flex items-center gap-2 text-[#7C3AED] hover:text-purple-700 -ml-2 group transition-colors"
        >
          <FiArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </Button>
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
       
       

        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] p-8 text-white relative">
          <div className="flex items-center gap-6">
            <img
              src={data.profileImage || "https://dummyimage.com/150"}
              alt={data.name}
              className="w-24 h-24 rounded-2xl border-4 border-white/20 shadow-lg object-cover"
            />
            <div>
              <h2 className="text-3xl font-bold">{data.name}</h2>
              <p className="text-violet-100 font-medium bg-white/10 px-3 py-1 rounded-full inline-block mt-2 text-sm">
                {data.position}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Employee ID" value={data.employee_id} />
            <Field label="Email Address" value={data.email} />
            <Field label="Phone Number" value={data.phone} />
            <Field label="System Role" value={data.role} />
            <Field label="Job Position" value={data.position} />
            <Field label="Employment Status" value={data.status} />
            <Field label="Joined Date" value={data.joinedDate} />
            <Field label="Left Date" value={data.leftDate} />
          </div>
        </div>
      </div>
    </div>
  );
}