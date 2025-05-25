import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getPosts, Post, PostFilter, deletePost, updatePost, getPost, Activity } from '../services/PostService';
import DeleteModal from './DeleteModal';
import EditPostModal from './EditPostModal';

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [titleFilter, setTitleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'draft' | 'scheduled' | 'published' | ''>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [isPublishedFilter, setIsPublishedFilter] = useState<boolean | null>(null);
  const [platforms, setPlatforms] = useState<{ id: number; type: string }[]>([]);
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<number[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [selectedPostActivities, setSelectedPostActivities] = useState<Activity[] | null>(null);

  const openActivitiesModal = (post: Post) => {
    setSelectedPostActivities(post.activities || []);
    setShowActivitiesModal(true);
  };

  const resetFilters = () => {
    setTitleFilter('');
    setStatusFilter('');
    setDateFilter('');
    setIsPublishedFilter(null);
    setSelectedPlatformIds([]);
  };


  const token = localStorage.getItem('token') || '';

  const handleEditSave = async (updatedPost: Partial<Post> & { platform_ids: number[] }) => {
  if (!postToEdit) return;

  try {
    setEditError(null);
    await updatePost(
      token,
      postToEdit.id,
      updatedPost.title || postToEdit.title,
      updatedPost.content || postToEdit.content,
      updatedPost.status || postToEdit.status,
      updatedPost.platform_ids,
      updatedPost.scheduled_time || postToEdit.scheduled_time || undefined
    );

    const data = await getPost(token, postToEdit.id);

    // Refresh posts after update
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postToEdit.id
          ? data.post
          : p
      )
    );

    setShowEditModal(false);
    setPostToEdit(null);
  } catch (err: any) {
    setEditError(err.message || 'Failed to update post');
    throw err;
  }
};

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      const filters: PostFilter = {
        page,
        per_page: perPage,
      };

      if (titleFilter) filters.title = titleFilter;
      if (statusFilter) filters.status = [statusFilter];
      if (dateFilter) filters.scheduled_date = dateFilter;
      if (isPublishedFilter !== null) filters.is_published = isPublishedFilter;
      if (selectedPlatformIds.length > 0) filters.platform_ids = selectedPlatformIds;

      try {
        const data = await getPosts(token, filters);
        setPosts(data.posts?.data ?? []);
        setTotalPages(data.posts?.last_page ?? 1);
        setPlatforms(data.platforms ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [token, page, perPage, titleFilter, statusFilter, dateFilter, isPublishedFilter, selectedPlatformIds]);

  const onPrevPage = () => setPage((p) => Math.max(p - 1, 1));
  const onNextPage = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link to="/posts/create" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />
          Create Post
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Filter by title"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
        <select
          // multiple
          value={selectedPlatformIds.map(String)}
          onChange={e => {
            const options = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
            setSelectedPlatformIds(options);
          }}
          className="border p-2 rounded"
          style={{ height: '40px' }}
        >
          {platforms.map(platform => (
            <option value={platform.id}>
              {platform.type}
            </option>
          ))}
      </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublishedFilter === true}
            onChange={() => setIsPublishedFilter(isPublishedFilter === true ? null : true)}
          />
          Published Only
        </label>

        <button
        onClick={resetFilters}
        className="ml-auto px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
      >
        Reset Filters
      </button>
      </div>

      

      <div className="bg-white rounded-lg shadow p-6 overflow-auto">
        {loading && <p>Loading posts...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="text-gray-600">No posts found.</p>
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="border-b font-semibold">
                  <th className="p-2">Title</th>
                  <th className="p-2">Content</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Scheduled Time</th>
                  <th className="p-2">Platforms</th>
                  <th className="p-2">Actions</th>
                  <th className="p-2">logs</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 max-w-20 truncate" title={post.title}>{post.title}</td>
                    <td className="p-2 max-w-48 truncate" title={post.content}>{post.content || 'N/A'}</td>
                    <td className="p-2 capitalize">{post.status}</td>
                    <td className="p-2">
                      {post.scheduled_time ? post.scheduled_time : 'N/A'}
                    </td>
                    <td className="p-2">
                      {post.platforms && post.platforms.length > 0
                        ? post.platforms.map(p => p.type).join(', ')
                        : 'None'}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => {
                          if (post.status !== 'published') {
                            setPostToEdit(post);
                            setShowEditModal(true);
                          }
                        }}
                        disabled={post.status === 'published'}
                        className={`px-2 py-1 text-white rounded text-sm ${
                          post.status === 'published'
                            ? 'bg-yellow-300 cursor-not-allowed'
                            : 'bg-yellow-500 hover:bg-yellow-600'
                        }`}
                        title={post.status === 'published' ? 'Published posts cannot be edited' : 'Edit post'}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          setPostToDelete(post);
                          setShowDeleteModal(true);
                        }}
                        className="ml-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => openActivitiesModal(post)}
                        className="px-3 py-1 rounded-full bg-gray-600 text-black text-xs hover:bg-gray-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={onPrevPage}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={onNextPage}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      <DeleteModal
      show={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={async () => {
        if (postToDelete) {
          try {
            await deletePost(token, postToDelete.id);
            setPosts(posts.filter(p => p.id !== postToDelete.id));
          } catch (err: any) {
            setError(err.message);
          }
        }
        setShowDeleteModal(false);
        setPostToDelete(null);
      }}
      postTitle={postToDelete?.title ?? ''}
    />

    {showEditModal && postToEdit && (
  <EditPostModal
    show={showEditModal}
    onClose={() => {
      setShowEditModal(false);
      setEditError(null);
    }}
    post={postToEdit}
    onSave={handleEditSave}
    platforms={platforms}
    error={editError}
  />
)}

{/* Activities Modal */}
      {showActivitiesModal && selectedPostActivities && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4 z-50">
    <div className="relative bg-white p-6 rounded max-w-lg max-h-[80vh] overflow-auto w-full">
      {/* Close button positioned inside modal */}
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        onClick={() => setShowActivitiesModal(false)}
      >
        Close
      </button>

      <h2 className="text-xl font-semibold mb-4">Activity Logs</h2>

      {selectedPostActivities.length === 0 ? (
        <p>No activities found for this post.</p>
      ) : (
        <ul className="space-y-2">
          {selectedPostActivities.map((act) => (
            <li key={act.id} className="border p-2 rounded">
              <p><strong>{act.description} at {new Date(act.created_at).toLocaleString()}</strong></p>
              {act.properties && (
  <div className="text-sm space-y-3">

    {/* Custom platform ID changes */}
    {act.properties && (
  <div className="text-sm space-y-3">

    {/* Default attribute changes */}
    {act.properties.attributes && Object.entries(act.properties.attributes).map(([key, newValue]) => {
      const oldValue = act.properties.old?.[key];

      if (oldValue !== newValue) {
        return (
          <div key={key}>
            <p className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</p>
            <p><span>Old:</span> {oldValue ?? '----'}</p>
            <p><span>New:</span> {newValue}</p>
          </div>
        );
      }

      return null;
    })}

    {/* Platform ID changes using dynamic platforms list */}
    {act.properties.old_platform_ids && act.properties.new_platform_ids && (() => {
      const oldIds = act.properties.old_platform_ids;
      const newIds = act.properties.new_platform_ids;

      const getPlatformName = (id: number) =>
        platforms.find((p: any) => p.id === id)?.type || `Platform #${id}`;

      const oldNames = oldIds.map(getPlatformName).join(', ');
      const newNames = newIds.map(getPlatformName).join(', ');

      return (
        <div>
          <p className="font-medium">Platforms:</p>
          <p><span className="text-gray-600">Before:</span> {oldNames}</p>
          <p><span className="text-gray-600">After:</span> {newNames}</p>
        </div>
      );
    })()}

  </div>
)}

  </div>
)}

            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
)}

    </div>
    
  );
}

export default Posts;
