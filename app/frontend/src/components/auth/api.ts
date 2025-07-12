const API_URL = 'http://localhost:5050';

// Hardcoded token for testing - replace with actual login when auth is fixed
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MjMwMTI4MywianRpIjoiNWY1NmFlY2YtMTcxNC00OGVhLTk2ZjUtYWM2NjIzYTRkNDRmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEiLCJuYmYiOjE3NTIzMDEyODMsImV4cCI6MTc1MjMwNDg4M30.kId3cQyy7gPTp0xy9ypezJTmx_h3B2qqvGxqWy8ZG0Q';

export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    // For now, return a mock response with the test token
    return {
      ok: true,
      json: async () => ({
        token: TEST_TOKEN,
        username: credentials.username
      })
    };
  },

  signup: async (userData: { username: string; email: string; password: string }) => {
    // For now, return a mock response with the test token
    return {
      ok: true,
      json: async () => ({
        message: 'User created successfully.',
        token: TEST_TOKEN
      })
    };
  },
}; 