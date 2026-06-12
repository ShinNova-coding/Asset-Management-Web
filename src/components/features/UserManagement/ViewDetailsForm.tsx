import type { Employee } from "../../../types/employee";
type Props = {
  data?: Employee;
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-500">{label}</label>

    <input
      type="text"
      value={value || "-"}
      disabled
      className="border rounded-xl px-3 py-2 bg-white text-gray-700"
    />
  </div>
);

export default function ViewDetailsForm({ data }: Props) {
  // Loading fallback
  if (!data) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading employee details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-2">
      <div className="bg-white shadow-xl rounded-2xl p-3 space-y-5">
        <h2 className="text-2xl font-semibold">Employee Details</h2>

        <div className="flex items-center gap-4">
          <img
            src={data.profileImage || "https://dummyimage.com/120" }
            alt={data.name || 'Employee'}
            className="w-20 h-20 rounded-full border object-cover"
          />

          <div>
            <p className="text-lg font-medium">{data.name}</p>
            
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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