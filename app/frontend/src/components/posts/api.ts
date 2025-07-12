const API_URL = 'http://localhost:5050';

// Hardcoded token for testing
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MjMwMTI4MywianRpIjoiNWY1NmFlY2YtMTcxNC00OGVhLTk2ZjUtYWM2NjIzYTRkNDRmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEiLCJuYmYiOjE3NTIzMDEyODMsImV4cCI6MTc1MjMwNDg4M30.kId3cQyy7gPTp0xy9ypezJTmx_h3B2qqvGxqWy8ZG0Q';

export const postsApi = {
  createPost: async (title: string, content: string, media?: File, allowComments: boolean = true, publicPost: boolean = true) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('allow_comments', allowComments.toString());
    formData.append('public_post', publicPost.toString());
    if (media) formData.append('media', media);
    
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
      },
      body: formData,
    });
    return response.json();
  },

  getPosts: async () => {
    const response = await fetch(`${API_URL}/api/posts`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
      },
    });
    return response.json();
  },

  likePost: async (postId: number) => {
    const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
      },
    });
    return response.json();
  },
}; 