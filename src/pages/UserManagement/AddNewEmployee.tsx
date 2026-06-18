import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  User,
  ChevronDown,
  Camera,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/api';
import { normalizeImageSource } from '../../lib/utils';
import type { Employee } from '../../types/employee';

const DEFAULT_TOKEN = '66|5TalCJ8YD62FDIoYKzJy0w7XosM72oLkVWdPFt4xf8ff92b9';

interface FormState {
  name: string;
  employee_id: string;
  email: string;
  position: string;
  joined_date: string;
  left_date: string;
  phone_number: string;
  status: string;
  role: string;
  password: string;
  password_confirmation: string;
}

const formatToInputDate = (dateString: string) => {
  if (!dateString || dateString === '-') return '';
  const date = new Date(dateString);

  if (!Number.isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }

  return dateString;
};

const convertImageToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(String(reader.result || ''));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const stripBase64Header = (base64String: string): string => {
  if (!base64String) return '';
  return base64String.includes(',') ? base64String.split(',')[1] : base64String;
};

const AddEmployeeForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const editItem = (location.state as { editItem?: Employee } | null)?.editItem;
  const editItemId = editItem?.id || editItem?.employee_id;
  const isEditMode = Boolean(editItem);

  const [formState, setFormState] = useState<FormState>({
    name: '',
    employee_id: '',
    email: '',
    position: '',
    joined_date: '',
    left_date: '',
    phone_number: '',
    status: 'active',
    role: 'admin',
    password: '',
    password_confirmation: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editItem) {
      const normalizedRole = editItem.role
        ? editItem.role.toLowerCase().replace(/-/g, ' ')
        : 'admin';

      setFormState({
        name: editItem.name,
        employee_id: editItem.employee_id,
        email: editItem.email,
        position: editItem.position === '-' ? '' : editItem.position,
        joined_date: formatToInputDate(editItem.joinedDate || ''),
        left_date: formatToInputDate(editItem.leftDate || ''),
        phone_number: editItem.phone === '-' ? '' : editItem.phone,
        status: editItem.status === '-' ? 'active' : editItem.status.toLowerCase(),
        role: editItem.role === '-' ? 'admin' : normalizedRole || 'admin',
        password: '',
        password_confirmation: '',
      });
      setProfileImage(
        editItem.profileImage === 'https://via.placeholder.com/120'
          ? null
          : normalizeImageSource(editItem.profileImage)
      );
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
      if (!formState.employee_id.trim()) throw new Error('Employee ID is required.');
      if (!formState.name.trim()) throw new Error('Name is required.');
      if (!formState.email.trim()) throw new Error('Email is required.');
      if (!formState.role.trim()) throw new Error('Role is required.');

      if (!isEditMode) {
        if (!formState.password) throw new Error('Password is required.');
        if (formState.password !== formState.password_confirmation) {
          throw new Error('Password and confirmation must match.');
        }
      } else if (formState.password && formState.password !== formState.password_confirmation) {
        throw new Error('Password and confirmation must match.');
      }

      const endpointPath = isEditMode ? '/user/id' : '/user';
      const method = isEditMode ? 'PATCH' : 'POST';

      const payload: Record<string, string> = {
        name: formState.name.trim(),
        employee_id: formState.employee_id.trim(),
        email: formState.email.trim(),
        position: formState.position.trim(),
        joined_date: formState.joined_date,
        left_date: formState.left_date,
        phone_number: formState.phone_number.trim(),
        status: formState.status,
        role: formState.role.trim(),
      };

      if (isEditMode) {
        if (!editItem?.id) {
          throw new Error('Could not update profile: Missing unique account identifier (UUID).');
        }
        payload.id = editItem.id;
      }

      if (formState.password) {
        payload.password = formState.password;
        payload.password_confirmation = formState.password_confirmation;
      }

      let finalizedImageString = '';

      if (profileFile) {
        const base64WithHeader = await convertImageToBase64(profileFile);
        finalizedImageString = stripBase64Header(base64WithHeader);
      } else if (profileImage && profileImage.startsWith('data:image')) {
        finalizedImageString = stripBase64Header(profileImage);
      } else if (isEditMode && editItem?.image) {
        finalizedImageString = stripBase64Header(editItem.image);
      } else {
        const dummyWithHeader = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
        finalizedImageString = stripBase64Header(dummyWithHeader);
      }

      payload.image = finalizedImageString;

      const savedToken = localStorage.getItem('token') || DEFAULT_TOKEN;
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', savedToken);
      }

      await apiFetch(endpointPath, {
        method,
        body: JSON.stringify(payload),
      });

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
    <div className=" bg-slate-50   font-sans text-slate-900 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col">
        <Link
          to="/employees"
          className="mb-4 flex items-center text-sm font-medium text-blue-600 hover:underline self-start"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-slate-800 mb-4">
          {isEditMode ? 'Edit Employee' : 'Add New Employee'}
        </h1>

        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 md:p-8 flex-1">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center mb-2">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200 flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-slate-500" />
                  )}
                </div>

                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer shadow-md"
                >
                  <Camera size={12} />
                </label>

                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Upload Employee Profile
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <section>
              <div className="flex items-center gap-3 mb-3 pb-1 border-b border-slate-200">
                <User size={16} className="text-slate-400" />
                <h2 className="text-base font-semibold text-blue-600">
                  General Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-600">
                    Name
                  </label>
                  <input
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Aung Aung"
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-600">
                    Employee ID
                  </label>
                  <input
                    name="employee_id"
                    value={formState.employee_id}
                    onChange={handleInputChange}
                    placeholder="e.g. EMP-2026-001"
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                    disabled={isEditMode}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-600">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="e.g. aung.aung@example.com"
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-600">
                    Position
                  </label>
                  <input
                    name="position"
                    value={formState.position}
                    onChange={handleInputChange}
                    placeholder="e.g. IT Support"
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-600">
                    Joined Date
                  </label>
                  <input
                    name="joined_date"
                    type="date"
                    value={formState.joined_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-600">
                    Left Date
                  </label>
                  <input
                    name="left_date"
                    type="date"
                    value={formState.left_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-600">
                  Phone Number
                </label>
                <input
                  name="phone_number"
                  type="tel"
                  value={formState.phone_number}
                  onChange={handleInputChange}
                  placeholder="e.g. 09123456789"
                  className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-600">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formState.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="resigned">Resigned</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-600">
                  Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formState.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                    <option value="hr">HR</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-600">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoComplete="new-password"
                  {...(!isEditMode ? { required: true } : {})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-600">
                  Confirm Password
                </label>
                <input
                  name="password_confirmation"
                  type="password"
                  value={formState.password_confirmation}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoComplete="new-password"
                  {...(!isEditMode ? { required: true } : {})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-xs border border-slate-300 text-slate-600 rounded-md hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
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