import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PostFilters from './PostFilters';
import LazyImage from './LazyImage';
import useDebounce from './useDebounce';
import { useInfiniteScroll } from './useInfiniteScroll';
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
  likes_count?: number;
  views_count?: number;
  category?: string;
  tags?: string[];
}

const PAGE_SIZE = 10;

// Add types for API responses
interface CategoriesResponse { categories: string[]; }
interface TagsResponse { tags: string[]; }

const PostList: React.FC = () => {
  // Filter/sort state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState('');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('newest');

  // Data state
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [tagsList, setTagsList] = useState<string[]>([]);

  // Debounced search/filter
  const debouncedSearch = useDebounce(search, 500);
  const debouncedCategory = useDebounce(category, 500);
  const debouncedVisibility = useDebounce(visibility, 500);
  const debouncedTag = useDebounce(tag, 500);
  const debouncedSort = useDebounce(sort, 500);

  // Fetch categories and tags on mount
  useEffect(() => {
    postsApi.getCategories?.().then((data: CategoriesResponse) => setCategories(data.categories || []));
    postsApi.getPopularTags?.().then((data: TagsResponse) => setTagsList(data.tags || []));
  }, []);

  // Fetch posts when filters change
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true);
    // eslint-disable-next-line
  }, [debouncedSearch, debouncedCategory, debouncedVisibility, debouncedTag, debouncedSort]);

  // Fetch posts function
  const fetchPosts = useCallback(async (pageNum: number, replace = false) => {
    setLoading(true);
    setError('');
    try {
      const params: any = {
        page: pageNum,
        per_page: PAGE_SIZE,
        search: debouncedSearch,
        category: debouncedCategory,
        visibility: debouncedVisibility,
        tag: debouncedTag,
        sort: debouncedSort,
      };
      const data = await postsApi.getPosts(params);
      const newPosts = data.posts || [];
      setPosts(prev => replace ? newPosts : [...prev, ...newPosts]);
      setHasMore(newPosts.length === PAGE_SIZE);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, debouncedCategory, debouncedVisibility, debouncedTag, debouncedSort]);

  // Infinite scroll handler
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  }, [loading, hasMore, page, fetchPosts]);

  const setSentinel = useInfiniteScroll({ hasMore, loading, onLoadMore: loadMore });

  // Memoized posts for performance
  const renderedPosts = useMemo(() => posts.map(post => (
    <div key={post.id} className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-xl font-bold">{post.title}</h2>
        <div className="text-sm text-gray-500">{formatDate(post.created_at)}</div>
      </div>
      <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />
      {post.media_url && (
        <div className="mb-4">
          <LazyImage src={`http://localhost:5050${post.media_url}`} alt="Post media" className="w-full h-48 object-cover rounded" />
        </div>
      )}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>{post.public_post ? '🌍 Public' : '🔒 Private'}</span>
          <span>{post.allow_comments ? '💬 Comments allowed' : '🚫 Comments disabled'}</span>
          {post.category && <span>🏷️ {post.category}</span>}
          {post.tags && post.tags.length > 0 && <span>🔖 {post.tags.join(', ')}</span>}
        </div>
        <div className="flex items-center space-x-4">
          <span>👍 {post.likes_count ?? 0}</span>
          <span>👁️ {post.views_count ?? 0}</span>
        </div>
      </div>
    </div>
  )), [posts]);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      <PostFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        visibility={visibility}
        onVisibilityChange={setVisibility}
        tag={tag}
        onTagChange={setTag}
        sort={sort}
        onSortChange={setSort}
        categories={categories}
        tags={tagsList}
      />
      {posts.length === 0 && !loading && !error && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">No posts found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or create a new post!</p>
          <button
            onClick={() => window.location.href = '/posts/create'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Your First Post
          </button>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={() => { setPosts([]); setPage(1); setHasMore(true); fetchPosts(1, true); }}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}
      <div className="space-y-6">
        {renderedPosts}
      </div>
      <div ref={setSentinel} />
      {loading && (
        <div className="flex flex-col gap-4 mt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-40" />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList; 