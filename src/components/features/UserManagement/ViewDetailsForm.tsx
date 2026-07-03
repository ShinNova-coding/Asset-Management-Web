import type { Employee } from "../../../types/employee";

type Props = {
  data?: Employee;
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-500">{label}</label>
    <div className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-sm text-gray-700 truncate">
      {value || "-"}
    </div>
  </div>
);

export default function ViewDetailsForm({ data }: Props) {
  // Loading fallback
  if (!data) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading 
      </div>
    );
  }

  return (
    <div className="max-w-6xl bg-[#F3F0F7] mx-auto p-4">
      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-blue-800">Employee Details</h2>

        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <img
            src={data.profileImage || "https://dummyimage.com/120"}
            alt={data.name || 'Employee'}
            className="w-20 h-20 rounded-full border border-slate-200 object-cover shadow-sm"
          />
          <div>
            <p className="text-xl font-semibold text-slate-800">{data.name}</p>
            <p className="text-sm text-slate-500">{data.position}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Employee ID" value={data.employee_id} />
          <Field label="Email" value={data.email} />
          <Field label="Phone Number" value={data.phone} />
          <Field label="Role" value={data.role} />
          <Field label="Position" value={data.position} />
          <Field label="Status" value={data.status} />
          <Field label="Joined Date" value={data.joinedDate} />
          <Field label="Left Date" value={data.leftDate} />
        </div>
      </div>
    </div>
  );
}