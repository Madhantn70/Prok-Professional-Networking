import React, { useState, useRef, useEffect } from 'react';
import { profileApi } from './api';
import { useNavigate } from 'react-router-dom';

interface ProfileForm {
  name: string;
  title: string;
  email: string;
  bio: string;
  skills: string;
  image: File | null;
}

const initialForm: ProfileForm = {
  name: '',
  title: '',
  email: '',
  bio: '',
  skills: '',
  image: null,
};

const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

const ProfileEdit: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Fetch mock profile data on mount
  useEffect(() => {
    setLoading(true);
    setFetchError('');
    profileApi.getProfile()
      .then(data => {
        setForm(f => ({
          ...f,
          name: data.user.username || '',
          title: data.user.title || '',
          email: data.user.email || '',
          bio: data.user.bio || '',
          skills: data.user.skills || '',
          image: null,
        }));
        setLoading(false);
      })
      .catch(err => {
        setFetchError('Failed to load profile.');
        setLoading(false);
      });
  }, []);

  // Real-time validation
  const validate = (field: string, value: string | File | null) => {
    let err = '';
    if (field === 'name') {
      if (!value) err = 'Name is required.';
      else if ((value as string).length < 3) err = 'At least 3 characters.';
    }
    if (field === 'title') {
      if (!value) err = 'Title is required.';
    }
    if (field === 'email') {
      if (!value) err = 'Email is required.';
      else if (!validateEmail(value as string)) err = 'Invalid email.';
    }
    if (field === 'bio') {
      if ((value as string).length > 300) err = 'Max 300 characters.';
    }
    if (field === 'skills') {
      if (!value || !(value as string).split(',').filter(s => s.trim()).length) err = 'At least 1 skill.';
    }
    if (field === 'image' && value) {
      const file = value as File;
      if (!file.type.startsWith('image/')) err = 'Must be an image file.';
    }
    setErrors(prev => ({ ...prev, [field]: err }));
    return err;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    validate(name, value);
  };

  const handleImage = (file: File | null) => {
    setForm(f => ({ ...f, image: file }));
    if (file) {
      validate('image', file);
      const reader = new FileReader();
      reader.onload = e => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    (Object.keys(form) as (keyof ProfileForm)[]).forEach(key => {
      if (validate(key, form[key])) hasError = true;
    });
    if (hasError) return;
    setSubmitting(true);
    setSuccess('');
    setFetchError('');
    try {
      await new Promise(res => setTimeout(res, 300));
      const res = await profileApi.updateProfile(form);
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      setFetchError('Failed to update profile.');
    }
    setSubmitting(false);
    setUploadProgress(0);
    if (form.image) {
      setUploadProgress(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 150);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto p-8 text-center text-gray-700">Loading profile...</div>;
  if (fetchError) return <div className="max-w-4xl mx-auto p-8 text-center text-red-500">{fetchError}</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Edit Profile</h1>
        <div className="flex flex-col items-center mb-6">
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2 cursor-pointer border-2 border-dashed border-blue-300"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118A7.5 7.5 0 0112 15.75a7.5 7.5 0 017.5 4.368" />
              </svg>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />
          </div>
          <span className="text-gray-500 text-xs">Profile Picture</span>
          {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded mt-2">
              <div className="bg-blue-500 h-2 rounded" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-800">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded text-gray-900 bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-800">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded text-gray-900 bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-800">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded text-gray-900 bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-800">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full p-2 border rounded text-gray-900 bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" rows={3} />
            {errors.bio && <div className="text-red-500 text-sm mt-1">{errors.bio}</div>}
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-1 text-gray-800">Skills <span className="text-gray-500 text-xs">(comma separated)</span></label>
            <input name="skills" value={form.skills} onChange={handleChange} className="w-full p-2 border rounded text-gray-900 bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            {errors.skills && <div className="text-red-500 text-sm mt-1">{errors.skills}</div>}
          </div>
          <div className="flex justify-center gap-4">
            <button type="submit" disabled={submitting} className="py-2 px-6 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition">
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="py-2 px-6 bg-gray-200 text-gray-700 rounded font-semibold hover:bg-gray-300 transition" onClick={() => window.history.back()}>
              Cancel
            </button>
          </div>
          {success && <div className="text-green-600 text-center mt-4">{success}</div>}
          {fetchError && <div className="text-red-500 text-center mt-4">{fetchError}</div>}
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit; 