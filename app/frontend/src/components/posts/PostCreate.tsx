import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'video/mp4'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const PostCreate: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [allowComments, setAllowComments] = useState(true);
  const [publicPost, setPublicPost] = useState(true);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, or MP4 files are allowed.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('File size must be less than 10MB.');
      return;
    }
    setMedia(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError('');
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, or MP4 files are allowed.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('File size must be less than 10MB.');
      return;
    }
    setMedia(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }
    if (!content || content === '<p><br></p>') {
      setError('Content cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('allow_comments', allowComments.toString());
      formData.append('public_post', publicPost.toString());
      if (media) formData.append('media', media);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5050/api/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create post');
      setSuccess('Post created successfully!');
      setTitle('');
      setContent('');
      setMedia(null);
      setPreviewUrl(null);
      setAllowComments(true);
      setPublicPost(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Create Post</h2>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className={`font-semibold ${tab === 'edit' ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => setTab('edit')}
            >
              Edit
            </button>
            <button
              type="button"
              className={`font-semibold ${tab === 'preview' ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => setTab('preview')}
            >
              Preview
            </button>
            <button
              type="submit"
              form="post-form"
              className="ml-4 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
        {tab === 'edit' ? (
          <form id="post-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Content</label>
              <ReactQuill
                value={content}
                onChange={setContent}
                placeholder="Write your post..."
                className="mb-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Media</label>
              <div
                className="border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-blue-400"
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  media && media.type.startsWith('image') ? (
                    <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto" />
                  ) : (
                    <video src={previewUrl} controls className="max-h-48 mx-auto" />
                  )
                ) : (
                  <div>
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-3xl">☁️</span>
                      <span className="text-gray-500">Drag and drop files here or click to upload</span>
                      <span className="text-xs text-gray-400">Supports images and videos up to 10MB</span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,video/mp4"
                  onChange={handleMediaChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
            </div>
            <div className="pt-2 border-t">
              <span className="block font-semibold mb-2">Post Settings</span>
              <label className="inline-flex items-center mr-6">
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={e => setAllowComments(e.target.checked)}
                  className="form-checkbox"
                />
                <span className="ml-2">Allow Comments</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={publicPost}
                  onChange={e => setPublicPost(e.target.checked)}
                  className="form-checkbox"
                />
                <span className="ml-2">Public Post</span>
              </label>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
          </form>
        ) : (
          <div className="p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-bold mb-2">{title || 'Untitled Post'}</h3>
            <div className="mb-2" dangerouslySetInnerHTML={{ __html: content || '<em>No content</em>' }} />
            {previewUrl && (
              <div className="mb-2">
                {media && media.type.startsWith('image') ? (
                  <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto" />
                ) : (
                  <video src={previewUrl} controls className="max-h-48 mx-auto" />
                )}
              </div>
            )}
            <div className="text-xs text-gray-500">
              {publicPost ? '🌍 Public' : '🔒 Private'} | {allowComments ? '💬 Comments allowed' : '🚫 Comments disabled'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCreate; 