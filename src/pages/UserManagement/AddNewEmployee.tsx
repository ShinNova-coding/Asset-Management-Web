import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  ChevronDown,
  Calendar,
  Camera,
} from 'lucide-react';

import { Link } from 'react-router-dom';

const AddEmployeeForm: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">

        {/* BACK */}
        <Link
          to="/employees"
          className="mb-4 flex items-center text-sm font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Add New Employee
        </h1>

        <div className="bg-gray-100 rounded-lg border border-slate-200 shadow-sm p-10">
          <form className="space-y-10">

            {/* PROFILE */}
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
                    <User size={40} className="text-slate-500" />
                  )}
                </div>

                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md"
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

            {/* GENERAL INFO */}
            <section>
              <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-200">
                <User size={20} className="text-slate-400" />
                <h2 className="text-lg font-semibold text-blue-600">
                  General Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* NAME */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Name
                  </label>
                  <input className="w-full px-4 py-3 rounded-md border bg-white" />
                </div>

                {/* EMP ID */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Employee ID
                  </label>
                  <input className="w-full px-4 py-3 rounded-md border bg-white" />
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Email
                  </label>
                  <input className="w-full px-4 py-3 rounded-md border bg-white" />
                </div>

                {/* POSITION */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Position
                  </label>
                  <input className="w-full px-4 py-3 rounded-md border bg-white" />
                </div>

                {/* JOINED DATE */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Joined Date
                  </label>
                  <div className="relative">
                    <input type="date" className="w-full px-4 py-3 border rounded-md bg-white" />
                    
                  </div>
                </div>

                {/* LEFT DATE */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Left Date
                  </label>
                  <div className="relative">
                    <input type="date" className="w-full px-4 py-3 border rounded-md bg-white" />
                    
                  </div>
                </div>

              </div>
            </section>

            {/* PHONE + STATUS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* PHONE */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Phone Number
                </label>
                <input className="w-full px-4 py-3 rounded-md border bg-white" />
              </div>

              {/* STATUS */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Status
                </label>

                <div className="relative">
                  <select className="w-full px-4 py-3 border rounded-md bg-white appearance-none">
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="resigned">Resigned</option>
                  </select>

                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 pt-6">
              <button className="px-8 py-2 border rounded">
                Cancel
              </button>

              <button className="px-8 py-2 bg-blue-600 text-white rounded">
                Save Employee
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeForm;