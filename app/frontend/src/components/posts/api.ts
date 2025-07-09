const API_URL = 'http://localhost:5050';

export const postsApi = {
  createPost: async (content: string, media?: File) => {
    const formData = new FormData();
    formData.append('content', content);
    if (media) formData.append('media', media);
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    return response.json();
  },

  getPosts: async () => {
    const response = await fetch(`${API_URL}/posts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },

  likePost: async (postId: number) => {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },
}; 