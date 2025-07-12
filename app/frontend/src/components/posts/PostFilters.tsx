import React from 'react';

interface PostFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  visibility: string;
  onVisibilityChange: (v: string) => void;
  tag: string;
  onTagChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  categories: string[];
  tags: string[];
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'likes', label: 'Most Liked' },
  { value: 'views', label: 'Most Viewed' },
];

const visibilityOptions = [
  { value: '', label: 'All' },
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

const PostFilters: React.FC<PostFiltersProps> = ({
  search, onSearchChange,
  category, onCategoryChange,
  visibility, onVisibilityChange,
  tag, onTagChange,
  sort, onSortChange,
  categories, tags
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-col md:flex-row md:items-center gap-4">
      <input
        type="text"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Search posts..."
        className="border rounded px-3 py-2 w-full md:w-64 focus:outline-none focus:ring focus:border-blue-300"
      />
      <select
        value={category}
        onChange={e => onCategoryChange(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-48"
      >
        <option value="">All Categories</option>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <select
        value={visibility}
        onChange={e => onVisibilityChange(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-36"
      >
        {visibilityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <select
        value={tag}
        onChange={e => onTagChange(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-48"
      >
        <option value="">All Tags</option>
        {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
      </select>
      <select
        value={sort}
        onChange={e => onSortChange(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-44"
      >
        {sortOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default PostFilters; 