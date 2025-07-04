const API_URL = 'http://localhost:5000';

// Mock data for development
const defaultMockUser = {
  username: 'Madhan',
  title: 'B.E - Electronics and Communication Engineering',
  email: 'john@example.com',
  bio: 'Experienced developer with a passion for building scalable web applications.',
  skills: 'React,Node.js,TypeScript',
  avatar: '',
};

const defaultMockActivity = [
  { type: 'Post', content: 'Shared a new post on React best practices.', date: '2024-06-01' },
  { type: 'Connection', content: 'Connected with Jane Smith.', date: '2024-05-28' },
  { type: 'Comment', content: 'Commented on a job posting.', date: '2024-05-25' },
];

const USE_MOCK_API = true; // Set to false to use real API

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
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },

  updateProfile: async (profileData: any) => {
    if (USE_MOCK_API) {
      await new Promise(res => setTimeout(res, 800));
      setLocalMockUser({ ...getLocalMockUser(), ...profileData });
      return { success: true, user: getLocalMockUser() };
    }
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(profileData),
    });
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
}; 