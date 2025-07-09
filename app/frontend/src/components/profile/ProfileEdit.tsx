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
  location: string;
  phone: string;
  languages: string;
}

const initialForm: ProfileForm = {
  name: '',
  title: '',
  email: '',
  bio: '',
  skills: '',
  image: null,
  location: '',
  phone: '',
  languages: '',
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
          location: data.user.location || '',
          phone: data.user.phone || '',
          languages: data.user.languages || '',
          image: null,
        }));
        setLoading(false);
      })
      .catch(err => {
        if (err.message && (err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('token'))){
          localStorage.removeItem('token');
          navigate('/login', { replace: true, state: { error: 'Please log in to edit your profile.' } });
        } else {
          setFetchError('Could not load profile. Please try again later.');
        }
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
      if ((value as string).length > 500) err = 'Max 500 characters.';
    }
    if (field === 'skills') {
      if (!value || !(value as string).split(',').filter(s => s.trim()).length) err = 'At least 1 skill.';
    }
    if (field === 'location') {
      if (!value) err = 'Location is required.';
    }
    if (field === 'phone') {
      if (value && !/^([+]?\d{1,3})?[- .]?\d{7,15}$/.test(value as string)) err = 'Invalid phone number.';
    }
    if (field === 'languages') {
      if (!value || !(value as string).split(',').filter(s => s.trim()).length) err = 'At least 1 language.';
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
      // Only send fields supported by backend
      const updatePayload = {
        title: form.title,
        bio: form.bio,
        skills: form.skills,
        location: form.location,
        phone: form.phone,
        languages: form.languages,
      };
      await profileApi.updateProfile(updatePayload);
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
    <div className="min-h-screen bg-white flex items-center justify-center font-sans">
      <div className="w-full max-w-2xl rounded-2xl shadow-2xl bg-white border border-gray-200 p-10 relative">
        {/* Logout button */}
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="absolute top-6 right-8 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition-all">Logout</button>
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-700 tracking-tight">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2 cursor-pointer border-4 border-dashed border-blue-300 hover:border-blue-500 transition"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1 text-blue-700">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full p-3 border rounded-lg text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-700">Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full p-3 border rounded-lg text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-700">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full p-3 border rounded-lg text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-700">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-3 border rounded-lg text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-700">Location</label>
              <input name="location" value={form.location} onChange={handleChange} className="w-full p-3 border rounded-lg text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              {errors.location && <div className="text-red-500 text-sm mt-1">{errors.location}</div>}
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-700">Languages <span className="text-gray-500 text-xs">(comma separated)</span></label>
              <input name="languages" value={form.languages} onChange={handleChange} className="w-full p-3 border rounded-lg text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              {errors.languages && <div className="text-red-500 text-sm mt-1">{errors.languages}</div>}
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1 text-blue-700">Skills <span className="text-gray-500 text-xs">(comma separated)</span></label>
              <input name="skills" value={form.skills} onChange={handleChange} className="w-full p-3 border rounded-lg text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              {errors.skills && <div className="text-red-500 text-sm mt-1">{errors.skills}</div>}
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1 text-blue-700">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full p-3 border rounded-lg text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" rows={4} />
              {errors.bio && <div className="text-red-500 text-sm mt-1">{errors.bio}</div>}
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button type="submit" disabled={submitting} className="py-3 px-8 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-all">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="py-3 px-8 bg-gray-200 text-black rounded-full font-semibold hover:bg-gray-300 transition-all" onClick={() => navigate('/profile')}>
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