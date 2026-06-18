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

const DEFAULT_TOKEN = '7|N5Vq58chJXHoyy7GqjuTEPH4CHJGLF6IplgxGtIQ2187ee5c'

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
  image?: any;       
  image_url?: any;   
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
        editItem.image === 'https://via.placeholder.com/120' || !editItem.image
          ? null
          : normalizeImageSource(editItem.image)
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

    
    const payload: Record<string, any> = {
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
        payload.image = finalizedImageString;
      } else if (profileImage && profileImage.startsWith('data:image')) {
        finalizedImageString = stripBase64Header(profileImage);
        payload.image = finalizedImageString;
      } else if (isEditMode && editItem?.image) {
        
      } else {
        payload.image = null;
      }

    
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
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-3xl center mx-auto">

        
        <Link
          to="/employees"
          className="mb-4 flex items-center text-sm font-medium text-blue-600 hover:underline "
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">
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
                <h2 className="text-lg font-semibold text-blue-600">
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
                    className="w-full px-4 py-3 rounded-md border bg-white"
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
                    className="w-full px-4 py-3 rounded-md border bg-white"
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
                    className="w-full px-4 py-3 rounded-md border bg-white"
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
                    className="w-full px-4 py-3 rounded-md border bg-white"
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
                      className="w-full px-4 py-3 border rounded-md bg-white"
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
                      className="w-full px-4 py-3 border rounded-md bg-white"
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
                  className="w-full px-4 py-3 rounded-md border bg-white"
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

              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Role
                </label>

                <div className="relative">
                  <select
                    name="role"
                    value={formState.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-md bg-white appearance-none"
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
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-md border bg-white"
                  autoComplete="new-password"
                  {...(!isEditMode ? { required: true } : {})}
                />
              </div>

              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Confirm Password
                </label>
                <input
                  name="password_confirmation"
                  type="password"
                  value={formState.password_confirmation}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3 rounded-md border bg-white"
                  autoComplete="new-password"
                  {...(!isEditMode ? { required: true } : {})}
                />
              </div>
            </div>

            
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
