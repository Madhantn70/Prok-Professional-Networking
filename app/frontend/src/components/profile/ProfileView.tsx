import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from './api';

interface ProfileData {
  id: number;
  username: string;
  email: string;
  title: string;
  bio: string;
  skills: string;
  avatar: string | null;
  location: string;
  phone: string;
  languages: string;
  connections: number;
  mutualConnections: number;
}

// Phone number validation regex
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileData | null>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    title: '',
    bio: '',
    skills: '',
    location: '',
    phone: '',
    languages: ''
  });

  useEffect(() => {
    setLoading(true);
    setError('');
    profileApi.getProfile()
      .then(data => {
        const userData = data.user;
        setUser(userData);
        setEditForm({
          title: userData.title || '',
          bio: userData.bio || '',
          skills: userData.skills || '',
          location: userData.location || '',
          phone: userData.phone || '',
          languages: userData.languages || ''
        });
        setActivity(data.activity || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message && (err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('token'))){
          localStorage.removeItem('token');
          navigate('/login', { replace: true, state: { error: 'Please log in to view your profile.' } });
        } else {
          setError('Could not load profile. Please try again later.');
        }
        setLoading(false);
      });
  }, []);

  const validatePhone = (phone: string): string => {
    if (!phone) return '';
    if (!PHONE_REGEX.test(phone)) {
      return 'Please enter a valid phone number';
    }
    return '';
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (editForm.title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }
    
    if (editForm.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters';
    }
    
    const phoneError = validatePhone(editForm.phone);
    if (phoneError) {
      errors.phone = phoneError;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size must be less than 2MB', 'error');
      return;
    }

    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('http://localhost:5050/api/profile/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setUser(prev => prev ? { ...prev, avatar: data.image_url } : null);
        setImagePreview(URL.createObjectURL(file));
        showToast('Profile image updated successfully!', 'success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload image');
      }
    } catch (error) {
      showToast('Failed to upload image. Please try again.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast('Please fix the validation errors', 'error');
      return;
    }

    setSaving(true);
    try {
      await profileApi.updateProfile(editForm);
      setUser(prev => prev ? { ...prev, ...editForm } : null);
      setEditMode(false);
      setValidationErrors({});
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    showToast('You have been logged out.', 'success');
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 800);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast-notification fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    
    // Add icon
    const icon = document.createElement('span');
    icon.className = 'mr-2';
    icon.innerHTML = type === 'success' ? '✓' : '✕';
    toast.insertBefore(icon, toast.firstChild);
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Banner Shimmer */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-64 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
          
          {/* Profile Header Shimmer */}
          <div className="relative px-8 pb-8 -mt-16">
            <div className="flex flex-col md:flex-row items-center md:items-end">
              <div className="w-32 h-32 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex-1 md:ml-8 mt-4 md:mt-0 text-center md:text-left">
                <div className="h-8 bg-gray-300 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Content Shimmer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-500 text-lg font-medium">{error || 'No user found.'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-3xl mx-auto pt-12 px-2 relative">
        {/* Logout button */}
        <button onClick={handleLogout} className="absolute top-6 right-8 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition-all">Logout</button>
        {/* Profile Card */}
        <div className="relative rounded-2xl shadow-2xl bg-white border border-gray-200 p-6 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10" style={{marginTop: '3.5rem'}}>
          {/* Profile Image with animated gradient border */}
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-full p-1 bg-gray-200 border-4 border-blue-300 flex items-center justify-center overflow-hidden">
              <img
                src={user?.avatar ? `http://localhost:5050${user.avatar}` : undefined}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 border-2 border-white"
            >
              {uploadingImage ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              )}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />
          </div>
          {/* Details */}
          <div className="flex-1 flex flex-col items-center md:items-start mt-4 md:mt-0">
            <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-1">{user?.username}</h1>
            <p className="text-lg text-blue-700 font-semibold mb-1 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 13.5c0 4.418-4.03 8-9 8s-9-3.582-9-8c0-.456.042-.904.122-1.342A12.083 12.083 0 0112 14z" /></svg>
              {user?.title || 'Professional'}
            </p>
            <p className="text-black text-base flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {user?.location || 'Location not set'}
            </p>
            <button
              onClick={() => navigate('/profile/edit')}
              className="mt-2 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all"
            >
              Edit Profile
            </button>
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* About */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                About
              </h3>
              <p className="text-black text-base">{user?.bio || 'No bio added yet.'}</p>
            </div>
            {/* Skills */}
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                Skills
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {user?.skills ? user.skills.split(',').map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-sm shadow-sm hover:scale-105 transition-all cursor-pointer">
                    {skill.trim()}
                  </span>
                )) : <span className="text-gray-400">No skills added yet.</span>}
              </div>
            </div>
            {/* Recent Activity */}
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Recent Activity
              </h3>
              <div className="text-gray-400 text-center py-6">No recent activity yet.</div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Contact Information
              </h3>
              <div className="text-black text-base flex flex-col gap-1">
                <span className="flex items-center gap-2"><svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 01-8 0 4 4 0 018 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m0 0H9m3 0h3" /></svg>{user?.email}</span>
                <span className="flex items-center gap-2"><svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>{user?.phone}</span>
                <span className="flex items-center gap-2"><svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{user?.location}</span>
              </div>
            </div>
            {/* Languages */}
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                Languages
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {user?.languages ? user.languages.split(',').map((lang, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-sm shadow-sm hover:scale-105 transition-all cursor-pointer">
                    {lang.trim()}
                  </span>
                )) : <span className="text-gray-400">No languages added yet.</span>}
              </div>
            </div>
            {/* Connections */}
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-lg text-center">
              <h3 className="text-lg font-bold text-blue-700 mb-2">Connections</h3>
              <div className="text-3xl font-extrabold text-blue-700 mb-1">{user?.connections || 0}+</div>
              <div className="text-gray-500 mb-2">Total Connections</div>
              <div className="text-lg font-semibold text-blue-700">
                {user?.mutualConnections || 0} <span className="text-gray-400 font-normal">Mutual</span>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-all">Grow Network</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView; 