const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Mock data for development
const defaultMockUser = {
  username: 'testuser',
  title: 'Software Developer',
  email: 'test@example.com',
  bio: 'Experienced developer with a passion for building scalable web applications.',
  skills: 'React,Node.js,TypeScript',
  avatar: '',
};

const defaultMockActivity = [
  { type: 'Post', content: 'Shared a new post on React best practices.', date: '2024-06-01' },
  { type: 'Connection', content: 'Connected with Jane Smith.', date: '2024-05-28' },
  { type: 'Comment', content: 'Commented on a job posting.', date: '2024-05-25' },
];

const USE_MOCK_API = false; // Use real API

function getLocalMockUser() {
  const data = localStorage.getItem('mockUser');
  return data ? JSON.parse(data) : defaultMockUser;
}

function setLocalMockUser(user: any) {
  localStorage.setItem('mockUser', JSON.stringify(user));
}

function getLocalMockActivity() {
  const data = localStorage.getItem('mockActivity');
  return data ? JSON.parse(data) : defaultMockActivity;
}

function setLocalMockActivity(activity: any) {
  localStorage.setItem('mockActivity', JSON.stringify(activity));
}

export const profileApi = {
  getProfile: async () => {
    if (USE_MOCK_API) {
      await new Promise(res => setTimeout(res, 600));
      return { user: getLocalMockUser(), activity: getLocalMockActivity() };
    }
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token');
    const response = await fetch(`${API_URL}/api/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('Profile fetch response status:', response.status);
    if (!response.ok) {
      if (response.status === 401 || response.status === 422) {
        throw new Error('Unauthorized');
      }
      const errorData = await response.json().catch(() => ({}));
      const error = errorData.error || errorData.msg || 'Unauthorized';
      throw new Error(error);
    }
    return response.json();
  },

  updateProfile: async (profileData: any) => {
    if (USE_MOCK_API) {
      await new Promise(res => setTimeout(res, 800));
      setLocalMockUser({ ...getLocalMockUser(), ...profileData });
      return { success: true, user: getLocalMockUser() };
    }
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token');
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update profile');
    }
    
    return response.json();
  },

  addActivity: async (activityItem: any) => {
    if (USE_MOCK_API) {
      const current = getLocalMockActivity();
      const updated = [activityItem, ...current];
      setLocalMockActivity(updated);
      return { success: true, activity: updated };
    }
    // Implement real API call here if needed
    return { success: false };
  },

  uploadProfileImage: async (file: File) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token');
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API_URL}/api/profile/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload image');
    }
    return response.json();
  },
}; 