"use client"

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  User,
  ChevronDown,
  Camera,
  Eye,    
  EyeOff,  
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { normalizeImageSource } from '../../lib/utils';

const DEFAULT_TOKEN = '7|N5Vq58chJXHoyy7GqjuTEPH4CHJGLF6IplgxGtIQ2187ee5c';

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
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const stripBase64Header = (base64String: any): string => {
  if (!base64String || typeof base64String !== 'string') return '';
  if (base64String.startsWith('http://') || base64String.startsWith('https://')) {
    return base64String;
  }
  if (base64String.includes(',')) {
    return base64String.split(',')[1];
  }
  return base64String;
};

const AddEmployeeForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const editItem = (location.state as { editItem?: any } | null)?.editItem;
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (editItem) {
      const rawRole = editItem.role || 'admin';
      const normalizedRole = rawRole !== '-' 
        ? rawRole.toLowerCase().replace(/-/g, ' ') 
        : 'admin';

      setFormState({
        name: editItem.name || '',
        employee_id: editItem.employee_id || '',
        email: editItem.email || '',
        position: editItem.position === '-' ? '' : (editItem.position || ''),
        joined_date: formatToInputDate(editItem.joined_date || editItem.joinedDate || ''),
        left_date: formatToInputDate(editItem.left_date || editItem.leftDate || ''),
        phone_number: editItem.phone_number === '-' || editItem.phone === '-' 
          ? '' 
          : (editItem.phone_number || editItem.phone || ''),
        status: editItem.status === '-' ? 'active' : (editItem.status?.toLowerCase() || 'active'),
        role: normalizedRole,
        password: '',
        password_confirmation: '',
      });

      if (editItem.image && typeof editItem.image === 'string' && editItem.image !== 'https://via.placeholder.com/120') {
        setProfileImage(normalizeImageSource(editItem.image));
      } else {
        setProfileImage(null);
      }
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
      } else if (formState.password) {
        if (formState.password !== formState.password_confirmation) {
          throw new Error('Password and confirmation must match.');
        }
      }

      const targetId = editItem?.id; 
      if (isEditMode && !targetId) {
        throw new Error('Missing account identifier (id) for update.');
      }

      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      
      const savedToken = localStorage.getItem('token') || DEFAULT_TOKEN;
      myHeaders.append("Authorization", `Bearer ${savedToken}`);

      
      const rawBody: Record<string, any> = {
        name: formState.name.trim(),
        employee_id: formState.employee_id.trim(),
        email: formState.email.trim(),
        position: formState.position.trim() || '-',
        joined_date: formState.joined_date || null, 
        left_date: formState.left_date || null,     
        phone_number: formState.phone_number.trim() || '-',
        status: formState.status,
        role: formState.role.trim(),
      };

      if (isEditMode) {
        rawBody.id = targetId;
      }

      if (formState.password) {
        rawBody.password = formState.password;
        rawBody.password_confirmation = formState.password_confirmation;
      }

      
      if (profileFile) {
        const base64WithHeader = await convertImageToBase64(profileFile);
        rawBody.image = stripBase64Header(base64WithHeader);
      } else if (!isEditMode) {
        rawBody.image = "";
      }

      const url = isEditMode 
        ? `http://192.168.100.185:1011/api/user/${targetId}` 
        : `http://192.168.100.185:1011/api/user`;
        
      const method = isEditMode ? 'PATCH' : 'POST';

      console.log("Sending Payload to Backend:", rawBody);

      const response = await fetch(url, {
        method: method,
        headers: myHeaders,
        body: JSON.stringify(rawBody),
        redirect: 'follow'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with status ${response.status}`);
      }

      const result = await response.json();
      console.log(`${isEditMode ? 'Update' : 'Create'} Success:`, result);

      navigate('/employees', { state: { refresh: true }, replace: true });

    } catch (err) {
      console.error('Submit error:', err);
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
    <div className="min-h-screen bg-[#F3F0F7] p-8 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        
        <Link
          to="/employees"
          className="mb-4 flex items-center text-sm font-medium text-blue-800"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-blue-800 mb-2">
          {isEditMode ? 'Edit Employee' : 'Add New Employee'}
        </h1>

        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-10">
          <form className="space-y-5" onSubmit={handleSubmit}>

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

            <section>
              <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-200">
                <User size={20} className="text-slate-400" />
                <h2 className="text-lg font-semibold text-blue-800">
                  General Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Name
                  </label>
                  <input
                    name="name"
                    value={formState.name} 
                    onChange={handleInputChange}
                    placeholder="e.g. Aung Aung"
                    className="w-full px-4 py-3 rounded-md border-slate-100 bg-slate-100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Employee ID
                  </label>
                  <input
                    name="employee_id"
                    value={formState.employee_id}
                    onChange={handleInputChange}
                    placeholder="e.g. EMP-2026-001"
                    className="w-full px-4 py-3 rounded-md border-slate-100 bg-slate-100"
                    required
                    disabled={isEditMode}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="e.g. aung.aung@example.com"
                    className="w-full px-4 py-3 rounded-md border-slate-100 bg-slate-100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Position
                  </label>
                  <input
                    name="position"
                    value={formState.position}
                    onChange={handleInputChange}
                    placeholder="e.g. IT Support"
                    className="w-full px-4 py-3 rounded-md border-slate-100 bg-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Joined Date
                  </label>
                  <div className="relative">
                    <input
                      name="joined_date"
                      type="date"
                      value={formState.joined_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-slate-100 rounded-md bg-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Left Date
                  </label>
                  <div className="relative">
                    <input
                      name="left_date"
                      type="date"
                      value={formState.left_date} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-slate-100 rounded-md bg-slate-100"
                    />
                  </div>
                </div>

              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Phone Number
                </label>
                <input
                  name="phone_number"
                  type="tel"
                  value={formState.phone_number} 
                  onChange={handleInputChange}
                  placeholder="e.g. 09123456789"
                  className="w-full px-4 py-3 rounded-md border-slate-100 bg-slate-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formState.status} 
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-slate-100 rounded-md bg-slate-100 appearance-none"
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

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formState.role} 
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-slate-100 rounded-md bg-slate-100 appearance-none"
                  >
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                    <option value="hr">HR</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Password {isEditMode && <span className="text-gray-400 font-normal">(Optional)</span>}
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'} 
                    value={formState.password} 
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="w-full px-4 pr-12 py-3 rounded-md border-slate-100 bg-slate-100"
                    autoComplete="new-password"
                    required={!isEditMode}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-slate-600"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    name="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'} 
                    value={formState.password_confirmation} 
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    className="w-full px-4 pr-12 py-3 rounded-md border-slate-100 bg-slate-100"
                    autoComplete="new-password"
                    required={!isEditMode}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-2 border rounded hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-blue-800 text-white rounded disabled:opacity-50 hover:bg-blue-900"
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