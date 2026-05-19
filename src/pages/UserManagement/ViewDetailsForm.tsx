import React, { useState, FC } from 'react';
import {
  ArrowLeft,
  User,
  Briefcase,
  ChevronDown,
  Calendar,
  Camera,
} from 'lucide-react';

import { Link } from 'react-router-dom';

/* =========================
   View Details Modal
========================= */

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { startDate: string; endDate: string }) => void;
};

const ViewDetailsForm: FC<Props> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      startDate,
      endDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-slate-800">
          Employee Date Details
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">

            {/* Start Date */}
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-600">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-600">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Dates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================
   Main Add Employee Form
========================= */

const AddEmployeeForm: React.FC = () => {
  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState<boolean>(false);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSaveDates = (data: {
    startDate: string;
    endDate: string;
  }) => {
    console.log('Saved Dates:', data);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <Link
          to="/employee-dates"
          className="mb-4 flex items-center text-sm font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Employee
        </Link>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Add New Employee
        </h1>

        {/* Form Card */}
        <div className="bg-gray-100 rounded-lg border border-slate-200 shadow-sm p-10">
          <form className="space-y-10">

            {/* Profile Upload */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200 flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User
                      size={40}
                      className="text-slate-500"
                    />
                  )}
                </div>

                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-md"
                >
                  <Camera size={16} />
                </label>

                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <p className="text-sm text-slate-500 mt-3">
                Upload Employee Profile
              </p>
            </div>

            {/* General Information */}
            <section>
              <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-200">
                <User
                  size={20}
                  className="text-slate-400"
                />

                <h2 className="text-lg font-semibold text-blue-600">
                  General Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Employee ID
                  </label>

                  <input
                    type="text"
                    placeholder="EMP-001"
                    className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="employee@gmail.com"
                    className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Joining Date
                  </label>

                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />

                    <Calendar
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Organizational Placement */}
            <section>
              <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-200">
                <Briefcase
                  size={20}
                  className="text-slate-400"
                />

                <h2 className="text-lg font-semibold text-blue-600">
                  Organizational Placement
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Position
                  </label>

                  <input
                    type="text"
                    placeholder="Frontend Developer"
                    className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Role / Access Level
                  </label>

                  <div className="relative">
                    <select className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-slate-700">
                      <option>Employee</option>
                      <option>Admin</option>
                      <option>HR</option>
                    </select>

                    <ChevronDown
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    placeholder="+95 9xxxxxxxx"
                    className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Status
                  </label>

                  <div className="relative">
                    <select className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-slate-700">
                      <option>Active</option>
                      <option>Suspend</option>
                    </select>

                    <ChevronDown
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* View Details Button */}
            <div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 rounded bg-slate-800 text-white hover:bg-slate-900"
              >
                View Employee Dates
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                className="px-8 py-2.5 rounded border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-2.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Save Employee
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      <ViewDetailsForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDates}
      />
    </div>
  );
};

export default AddEmployeeForm;