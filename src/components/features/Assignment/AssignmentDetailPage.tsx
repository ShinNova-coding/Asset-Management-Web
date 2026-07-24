"use client";


import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FiCalendar, FiUser, FiCpu, FiFileText, 
   FiArrowLeft
} from "react-icons/fi";
import type { Assignment } from "@/data/assignmentdata";
import { apiRequest } from "@/lib/apiService";

const AssignmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecordDetails = async () => {
      const stateData = location.state as { editItem?: Assignment } | null;
      if (stateData?.editItem) {
        setFormData(stateData.editItem);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await apiRequest(`/assignment/assignment_id?assignment_id=${id}`, "GET");
        if (response?.success) {
          setFormData(Array.isArray(response.data) ? response.data[0] : response.data);
        } else {
          throw new Error(response?.message || "Failed to locate target record.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRecordDetails();
  }, [id, location.state]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error || !formData) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <Card className="max-w-md w-full text-center p-8 border-none shadow-xl rounded-3xl">
        <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <FiFileText size={32} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Record Not Found</h1>
        <p className="text-slate-500 mb-6">{error || "The requested assignment could not be retrieved."}</p>
        <Button onClick={() => navigate("/assignment")} className="w-full bg-blue-600 hover:bg-blue-700">Return to List</Button>
      </Card>
    </div>
  );

  const isActive = formData.status?.toLowerCase() === "active";
  const displayUserId = formData.user?.employee_id || formData.employee_id || formData.users_id || "N/A";
  const displayUserName = formData.user?.name || formData.user_name || "Unknown User";
  const displayAssetCode = formData.asset?.asset_code || formData.asset_code || formData.assets_id || "N/A";
  const displayAssetName = formData.asset?.name || formData.asset_name || "Unknown Asset Unit";

  return (
    <div className="min-h-screen bg-[#e9e5ff] p-4 md:p-10 font-sans">
      <div className="max-w-8xl mx-auto space-y-6">
        
        {/* Navigation */}
        <Button variant="ghost" onClick={() => navigate("/assignment")} className="text-[#7C3AED] hover:text-blue-900 pl-0">
          <FiArrowLeft className="mr-2" /> Back
        </Button>

        {/* Title Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#7C3AED]">Assignment Details</h1>
            
          </div>
          <div className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-[#7C3AED]"}`}>
            <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-blue-500"}`} />
            {formData.status || "Unknown"}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#7C3AED]">
          <DetailCard title="Personnel"  icon={<FiUser className="text-[#7C3AED]"/>}>
            <DetailItem label="Employee ID" value={displayUserId} />
            <DetailItem label="Full Name" value={displayUserName} />
          </DetailCard>

          <DetailCard title="Hardware Allocation" icon={<FiCpu className="text-[#7C3AED]"/>}>
            <DetailItem label="Asset Name" value={displayAssetName} />
            <DetailItem label="Asset Code" value={displayAssetCode} />
          </DetailCard>
        </div>

        <DetailCard title="Notes & Timeline" icon={<FiCalendar className="text-[#7C3AED]"/>}>
          <DetailItem label="Assigned Date" value={formData.assigned_date || "Not set"} />
          <div className="mt-4 pt-4 border-t border-slate-100">
            <label className="text-xs font-semibold uppercase text-black">Notes</label>
            <p className="text-sm text-slate-700 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              {formData.note || "No additional notes provided."}
            </p>
          </div>
        </DetailCard>
      </div>
    </div>
  );
};


const DetailCard = ({ title, icon, children }: any) => (
  <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white">
    <CardContent className="p-6">
      <div className="flex items-center gap-2 mb-6 text-[#7C3AED] font-bold">
        {icon} {title}
      </div>
      {children}
    </CardContent>
  </Card>
);

const DetailItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between py-2 border-b border-slate-50 last:border-0">
    <span className="text-xs font-semibold uppercase text-black">{label}</span>
    <span className="text-sm font-medium text-slate-900">{value}</span>
  </div>
);

export default AssignmentDetailPage;