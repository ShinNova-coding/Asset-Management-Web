"use client";

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  User,
  Camera,
  Clock,
  Eye,     
  EyeOff,  
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cacheProfileImage, getFirstAccessiblePath, getStoredPermissions, normalizeImageSource } from '../../lib/utils';
import { apiFetch } from '../../lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FALLBACK_ROLES = ['admin', 'employee', 'hr'];

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

const unwrapSavedUser = (responseData: any) => {
  const candidate = responseData?.data?.data || responseData?.data || responseData?.user || responseData;
  return Array.isArray(candidate) ? null : candidate;
};

const getStoredProfileUser = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser && typeof storedUser === 'object' && !Array.isArray(storedUser)) {
      return {
        ...storedUser,
        role: storedUser.roles?.[0]?.name || storedUser.role || localStorage.getItem('user_role') || 'employee',
        email: storedUser.email || localStorage.getItem('user_email') || '',
      };
    }
  } catch {
    // Fall back to the minimal login fields below.
  }

  const email = localStorage.getItem('user_email') || '';
  const role = localStorage.getItem('user_role') || 'employee';

  return email
    ? {
        email,
        name: email.split('@')[0],
        role,
        status: 'active',
      }
    : null;
};

const getUserCandidate = (response: any) => {
  const candidate = response?.data?.data || response?.data?.user || response?.data || response?.user || response;
  return candidate && typeof candidate === 'object' && !Array.isArray(candidate) ? candidate : null;
};

const isSameProfileUser = (candidate: any, profile: any) => {
  const candidateEmail = String(candidate?.email || '').toLowerCase();
  const profileEmail = String(profile?.email || '').toLowerCase();

  return (
    (!!candidate?.id && !!profile?.id && String(candidate.id) === String(profile.id)) ||
    (!!candidate?.employee_id && !!profile?.employee_id && String(candidate.employee_id) === String(profile.employee_id)) ||
    (!!candidateEmail && !!profileEmail && candidateEmail === profileEmail)
  );
};

const resolveProfileUser = async (profile: any) => {
  if (profile?.id) return profile;

  const identifier = profile?.employee_id || profile?.email || localStorage.getItem('user_email') || '';
  const endpoints = [
    '/profile',
    '/me',
    '/auth/me',
    '/user/profile',
    identifier ? `/user/${encodeURIComponent(identifier)}` : '',
    identifier ? `/user/id?id=${encodeURIComponent(identifier)}` : '',
  ].filter(Boolean);

  for (const endpoint of endpoints) {
    try {
      const response = await apiFetch(endpoint);
      const user = getUserCandidate(response);
      if (user) return { ...profile, ...user };
    } catch {
      // Try the next profile endpoint shape.
    }
  }

  try {
    const response = await apiFetch('/user');
    const users = response?.data?.data || response?.data || response || [];
    if (Array.isArray(users)) {
      const foundUser = users.find((candidate: any) => isSameProfileUser(candidate, profile));
      if (foundUser) return { ...profile, ...foundUser };
    }
  } catch {
    // Some roles cannot view the full user list.
  }

  return profile;
};

const normalizeRolesPayload = (payload: any) => {
  const roles = payload?.data?.data || payload?.data || payload || [];
  if (!Array.isArray(roles)) return [];

  return roles
    .map((role: any) => role?.name || role?.role_name || role?.title || "")
    .filter((name: string) => name && name !== "-");
};

const uniqueRoles = (roles: string[]) =>
  Array.from(new Set(roles.filter(Boolean)));

const AddEmployeeForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isProfileEditMode = location.pathname.toLowerCase() === '/profile/edit';
  const editItem = (location.state as { editItem?: any } | null)?.editItem || (isProfileEditMode ? getStoredProfileUser() : null);
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
  const [roleOptions, setRoleOptions] = useState<string[]>(FALLBACK_ROLES);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (editItem) {
      const rawRole = editItem.role || 'admin';
      const normalizedRole = rawRole !== '-' ? rawRole : 'admin';

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

  useEffect(() => {
    const fetchRoleOptions = async () => {
      try {
        const response = await apiFetch('/role', { method: 'GET' });
        const fetchedRoles = normalizeRolesPayload(response);
        const currentRole = editItem?.role && editItem.role !== '-' ? editItem.role : '';
        setRoleOptions(uniqueRoles([...fetchedRoles, currentRole, ...FALLBACK_ROLES]));
      } catch (err) {
        console.error('Failed to fetch roles:', err);
        const currentRole = editItem?.role && editItem.role !== '-' ? editItem.role : '';
        setRoleOptions(uniqueRoles([currentRole, ...FALLBACK_ROLES]));
      }
    };

    fetchRoleOptions();
  }, [editItem]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: "status" | "role", value: string | null) => {
    if (value === null) return;

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
    if (isProfileEditMode) {
      navigate(getFirstAccessiblePath(getStoredPermissions()) || '/dashboard');
      return;
    }

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

      const resolvedEditItem = isProfileEditMode ? await resolveProfileUser(editItem) : editItem;
      const targetId = resolvedEditItem?.id; 
      if (isEditMode && !targetId) {
        throw new Error('Missing account identifier (id) for profile update. Please logout and login again.');
      }

      if (!localStorage.getItem('token')) {
        throw new Error('Missing authentication token. Please login again.');
      }

      const rawBody: Record<string, any> = {
        name: formState.name.trim(),
        employee_id: formState.employee_id.trim(),
        email: formState.email.trim(),
        position: formState.position.trim() || '-',
        joined_date: formState.joined_date || null, 
        left_date: formState.left_date || null,    
        phone_number: formState.phone_number.trim() || '-',
        status: formState.status,
            role: isProfileEditMode ? resolvedEditItem?.roles?.[0]?.name || resolvedEditItem?.role || formState.role.trim() : formState.role.trim(),
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
      }

      const method = isEditMode ? 'PATCH' : 'POST';

      const responseData = await apiFetch(isEditMode ? `/user/${targetId}` : '/user', {
        method,
        body: JSON.stringify(rawBody),
      });

      const savedUser = unwrapSavedUser(responseData);
      const savedUserWithImage =
        savedUser && !Array.isArray(savedUser)
          ? {
              ...savedUser,
              image: savedUser.image || rawBody.image || editItem?.image || null,
            }
          : savedUser;

      cacheProfileImage({
        ...rawBody,
        ...(savedUserWithImage && !Array.isArray(savedUserWithImage) ? savedUserWithImage : {}),
        email: rawBody.email,
        employee_id: rawBody.employee_id,
        image: rawBody.image || savedUserWithImage?.image || editItem?.image || null,
      });

      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      const isCurrentUser =
        storedUser &&
        isEditMode &&
        (
          String(storedUser.id || '') === String(targetId || '') ||
          String(storedUser.employee_id || '') === String(formState.employee_id || '') ||
          String(storedUser.email || '').toLowerCase() === String(formState.email || '').toLowerCase()
        );

      if (isCurrentUser) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...storedUser,
            ...(savedUserWithImage && !Array.isArray(savedUserWithImage) ? savedUserWithImage : {}),
            position: savedUserWithImage?.position || rawBody.position || storedUser.position || null,
            phone_number: savedUserWithImage?.phone_number || rawBody.phone_number || storedUser.phone_number || null,
            joined_date: savedUserWithImage?.joined_date || rawBody.joined_date || storedUser.joined_date || null,
            left_date: savedUserWithImage?.left_date || rawBody.left_date || storedUser.left_date || null,
            role: savedUserWithImage?.role || rawBody.role || storedUser.role || null,
            roles: savedUserWithImage?.roles || resolvedEditItem?.roles || storedUser.roles || [],
            image: rawBody.image || savedUserWithImage?.image || storedUser.image || null,
            image_url: savedUserWithImage?.image_url || storedUser.image_url || null,
            preview_url: savedUserWithImage?.preview_url || storedUser.preview_url || null,
            media: savedUserWithImage?.media || storedUser.media || [],
          })
        );
        window.dispatchEvent(new Event('profile_updated'));
      }

      if (isProfileEditMode) {
        navigate(getFirstAccessiblePath(getStoredPermissions()) || '/dashboard', { replace: true });
      } else {
        navigate('/employees', {
          state: {
            refresh: true,
            savedUser: savedUserWithImage,
          },
          replace: true,
        });
      }

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
    <div className="w-full bg-[#e9e5ff] pt-2 px-4 pb-6 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Back Button & Title Area */}
        <div className="flex flex-col gap-1">
          <Link
            to={isProfileEditMode ? (getFirstAccessiblePath(getStoredPermissions()) || "/dashboard") : "/employees"}
            className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#7C3AED] hover:text-purple-700 transition-colors"
          >
            <ArrowLeft size={14} className="mr-1.5" />
            Back 
          </Link>
          <h1 className="text-xl font-bold text-[#7C3AED]">
            {isProfileEditMode ? 'Edit My Profile' : isEditMode ? 'Edit Employee Profile' : 'Add New Employee'}
          </h1>
        </div>

        {/* Form Card Container */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6 md:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>

            <div className="flex flex-col items-center justify-center rounded-xl p-4 border border-dashed border-violet-200 bg-violet-50/40">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200 flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      onError={(event) => {
                        event.currentTarget.src = 'https://via.placeholder.com/120';
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={36} className="text-slate-400" />
                  )}
                </div>

                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-[#7C3AED] hover:bg-purple-700  p-2 rounded-full cursor-pointer shadow-md transition-colors"
                >
                  <Camera size={14} />
                </label>

                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-lg border border-violet-100 bg-white px-3 py-2 text-xs text-slate-600">
                <Clock size={14} className="text-[#7C3AED]" />
                <span>
                  {profileImage
                    ? 'Profile photo selected'
                    : 'No profile photo yet. You can add it later from edit.'}
                </span>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* General Information Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <User size={18} className="text-purple-600" />
                <h2 className="text-md font-bold text-purple-800">
                  General Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
               <div className="space-y-1.5">
  <label className="text-xs font-semibold text-slate-600">
    Full Name <span className="text-red-500">*</span>
  </label>
  <input
    name="name"
    type="text"
    value={formState.name} 
    onChange={handleInputChange}
    onInput={(e) => {
      // Allows letters (including common diacritics/accents), spaces, dots, and hyphens, but strips out numbers and special symbols
      e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-ZÀ-ÿ\s.\-]/g, "");
    }}
    placeholder="e.g. Aung Aung"
    className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all bg-white border-slate-200"
    required
  />
</div>
                {/* Employee ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="employee_id"
                    value={formState.employee_id}
                    onChange={handleInputChange}
                    placeholder="e.g. EMP-001"
                    disabled={isEditMode}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none ${
                      isEditMode ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-70' : 'bg-white border-slate-200'
                    }`}
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="e.g. aung.aung@example.com"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all bg-white border-slate-200"
                    required
                  />
                </div>

                {/* Position */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    Position
                  </label>
                  <input
                    name="position"
                    value={formState.position}
                    onChange={handleInputChange}
                    placeholder="e.g. Developer"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all bg-white border-slate-200"
                  />
                </div>

                {/* Joined Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    Joined Date
                  </label>
                  <input
                    name="joined_date"
                    type="date"
                    value={formState.joined_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all bg-white border-slate-200"
                  />
                </div>

                {/* Left Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    Left Date
                  </label>
                  <input
                    name="left_date"
                    type="date"
                    value={formState.left_date} 
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      isEditMode
                        ? 'focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] bg-white border-slate-200'
                        : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </section>

            {/* Status, Role & Contact Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Phone Number */}
            <div className="space-y-1.5">
  <label className="text-xs font-semibold text-slate-600">
    Phone Number
  </label>
  <input
    name="phone_number"
    type="text"
    maxLength={13}
    value={formState.phone_number} 
    onChange={handleInputChange}
    onInput={(e) => {
      // Strips non-digits and limits to a maximum of 13 characters
      e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 13);
    }}
    placeholder="e.g. 09123456789"
    className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all bg-white border-slate-200"
  />
</div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Status
                </label>
                <Select
                  value={formState.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                  disabled={isProfileEditMode}
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white px-3 text-sm text-slate-800 focus-visible:border-[#A78BFA] focus-visible:ring-[#EDE9FE]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-[#DDD6FE] bg-white shadow-lg">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="resigned">Resigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* System Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Role
                </label>
                <Select
                  value={formState.role}
                  onValueChange={(value) => handleSelectChange("role", value)}
                  disabled={isProfileEditMode}
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white px-3 text-sm text-slate-800 focus-visible:border-[#A78BFA] focus-visible:ring-[#EDE9FE]">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-[#DDD6FE] bg-white shadow-lg">
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Password {isEditMode && <span className="text-slate-400 font-normal">(Leave blank to keep unchanged)</span>}
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'} 
                    value={formState.password} 
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="w-full px-3 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all bg-white border-slate-200"
                    autoComplete="new-password"
                    required={!isEditMode}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    name="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'} 
                    value={formState.password_confirmation} 
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    className="w-full px-3 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all bg-white border-slate-200"
                    autoComplete="new-password"
                    required={!isEditMode}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-slate-200 text-red-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors shadow-sm"
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
