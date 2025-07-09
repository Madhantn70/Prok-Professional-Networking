const API_URL = 'http://localhost:5050';

export const feedApi = {
  getFeed: async () => {
    const response = await fetch(`${API_URL}/feed`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },

  getFeedByUser: async (userId: number) => {
    const response = await fetch(`${API_URL}/feed/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },
}; 