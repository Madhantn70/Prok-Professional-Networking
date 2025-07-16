const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const postsApi = {
  createPost: async (title: string, content: string, media?: File, allowComments: boolean = true, publicPost: boolean = true) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('allow_comments', allowComments.toString());
    formData.append('public_post', publicPost.toString());
    if (media) formData.append('media', media);
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token');
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  getPosts: async (params?: any) => {
    let url = `${API_URL}/api/posts`;
    if (params) {
      const query = Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&');
      if (query) url += `?${query}`;
    }
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token');
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getCategories: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token');
    const response = await fetch(`${API_URL}/api/posts/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getPopularTags: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token');
    const response = await fetch(`${API_URL}/api/posts/popular-tags`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  likePost: async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token');
    const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
}; 