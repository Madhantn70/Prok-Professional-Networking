import React, { useState, useEffect } from 'react';
import { postsApi } from './api';

interface Post {
  id: number;
  title: string;
  content: string;
  media_url: string | null;
  created_at: string;
  user_id: number;
  allow_comments: boolean;
  public_post: boolean;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsApi.getPosts();
      if (data.error) {
        setError(data.error);
      } else {
        setPosts(data.posts || data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={fetchPosts}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <button 
          onClick={() => window.location.href = '/posts/create'}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Post
        </button>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-4">Be the first to create a post!</p>
          <button 
            onClick={() => window.location.href = '/posts/create'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <div className="text-sm text-gray-500">
                  {formatDate(post.created_at)}
                </div>
              </div>
              
              <div 
                className="text-gray-700 mb-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {post.media_url && (
                <div className="mb-4">
                  {post.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img 
                      src={`http://localhost:5050${post.media_url}`} 
                      alt="Post media" 
                      className="max-w-full h-auto rounded"
                    />
                  ) : (
                    <video 
                      src={`http://localhost:5050${post.media_url}`} 
                      controls 
                      className="max-w-full h-auto rounded"
                    />
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>{post.public_post ? '🌍 Public' : '🔒 Private'}</span>
                  <span>{post.allow_comments ? '💬 Comments allowed' : '🚫 Comments disabled'}</span>
                </div>
                <span>Post ID: {post.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList; 