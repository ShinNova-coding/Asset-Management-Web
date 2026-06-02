import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  User,
  ChevronDown,
  Camera,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Employee } from '../../types/employee';

const API_URL = 'http://192.168.100.185:1010/api/user';
const DEFAULT_TOKEN = '119|6UBfGxzFSshZIwJu69IWBcmbq9gIb9opQwlL2eX51d4a76c8';

interface FormState {
  name: string;
  employeeId: string;
  email: string;
  position: string;
  joinedDate: string;
  leftDate: string;
  phoneNumber: string;
  status: string;
}

const AddEmployeeForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const editItem = (location.state as { editItem?: Employee } | null)?.editItem;
  const isEditMode = Boolean(editItem);

  const [formState, setFormState] = useState<FormState>({
    name: '',
    employeeId: '',
    email: '',
    position: '',
    joinedDate: '',
    leftDate: '',
    phoneNumber: '',
    status: 'active',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingToken = localStorage.getItem('token');
      if (!existingToken) {
        localStorage.setItem('token', DEFAULT_TOKEN);
      }
    }
  }, []);

  useEffect(() => {
    if (editItem) {
      setFormState({
        name: editItem.name,
        employeeId: editItem.employeeId,
        email: editItem.email,
        position: editItem.position === '-' ? '' : editItem.position,
        joinedDate: editItem.startDate === '-' ? '' : editItem.startDate,
        leftDate: editItem.endDate === '-' ? '' : editItem.endDate,
        phoneNumber: editItem.phone === '-' ? '' : editItem.phone,
        status: editItem.status.toLowerCase(),
      });
      setProfileImage(editItem.profileImage);
    }
  }, [editItem]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setProfileFile(file);
    }
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isEditMode
        ? `${API_URL}/${formState.employeeId}`
        : API_URL;
      const method = isEditMode ? 'PUT' : 'POST';

      const body = new FormData();
      body.append('name', formState.name);
      body.append('employee_id', formState.employeeId);
      body.append('email', formState.email);
      body.append('position', formState.position);
      body.append('joined_date', formState.joinedDate);
      body.append('left_date', formState.leftDate);
      body.append('phone_number', formState.phoneNumber);
      body.append('status', formState.status);

      if (profileFile) {
        body.append('image', profileFile);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(endpoint, {
        method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body,
      });

      if (!response.ok) {
        let message = `API Error: ${response.status}`;
        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch (parseErr) {
          console.error('Error parsing API error response:', parseErr);
        }
        throw new Error(message);
      }

      navigate('/employees', { state: { refresh: true }, replace: true });
    } catch (err) {
      console.error('AddNewEmployee submit error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save employee. Please try again.'
      );
    } finally {
      setLoading(false);
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
          {isEditMode ? 'Edit Employee' : 'Add New Employee'}
        </h1>

        <div className="bg-gray-100 rounded-lg border border-slate-200 shadow-sm p-10">
          <form className="space-y-10" onSubmit={handleSubmit}>

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

            {error && (
              <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

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
                  <input
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-md border bg-white"
                    required
                  />
                </div>

                {/* EMP ID */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Employee ID
                  </label>
                  <input
                    name="employeeId"
                    value={formState.employeeId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-md border bg-white"
                    required
                    disabled={isEditMode}
                  />
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-md border bg-white"
                    required
                  />
                </div>

                {/* POSITION */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Position
                  </label>
                  <input
                    name="position"
                    value={formState.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-md border bg-white"
                  />
                </div>

                {/* JOINED DATE */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Joined Date
                  </label>
                  <div className="relative">
                    <input
                      name="joinedDate"
                      type="date"
                      value={formState.joinedDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-md bg-white"
                    />
                  </div>
                </div>

                {/* LEFT DATE */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Left Date
                  </label>
                  <div className="relative">
                    <input
                      name="leftDate"
                      type="date"
                      value={formState.leftDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-md bg-white"
                    />
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
                <input
                  name="phoneNumber"
                  type="tel"
                  value={formState.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-md border bg-white"
                />
              </div>

              {/* STATUS */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Status
                </label>

                <div className="relative">
                  <select
                    name="status"
                    value={formState.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-md bg-white appearance-none"
                  >
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
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Employee'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeForm;