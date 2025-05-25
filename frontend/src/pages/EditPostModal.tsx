import React, { useState, useEffect } from 'react';
import {Post} from '../services/postService';

interface EditPostModalProps {
  show: boolean;
  onClose: () => void;
  post: Post | null;
  onSave: (updatedPost: Partial<Post> & { platform_ids: number[] }) => Promise<void>;
  platforms: { id: number; type: string }[];
  error?: string | null;
}

function EditPostModal({ show, onClose, post, onSave, platforms, error: externalError }: EditPostModalProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published' | ''>(post?.status || '');
  const [scheduledTime, setScheduledTime] = useState(post?.scheduled_time || '');
  const [selectedPlatformsIds, setSelectedPlatformsIds] = useState<number[]>(post?.platforms || []);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content || '');
      setStatus(post.status || '');
      setScheduledTime(post.scheduled_time || '');
      setSelectedPlatformsIds(post.platforms.map(p => typeof p === 'object' ? p.id : p));
      setError(null);
    }
  }, [post, show]);

  const formatScheduledTime = (time: string) => {
    const replaced = time.replace('T', ' ');
    // Check if seconds are missing (length or regex)
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(replaced)) {
        return replaced + ':00';
    }
    return replaced; // already has seconds
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (status === 'scheduled' && !scheduledTime) {
      setError('Scheduled time is required for scheduled posts');
      return;
    }
    if (selectedPlatformsIds.length === 0) {
      setError('At least one platform must be selected');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave({
        title: title.trim(),
        content,
        status,
        scheduled_time: status === 'scheduled' ? formatScheduledTime(scheduledTime) : null,
        platform_ids: selectedPlatformsIds,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            {(error || externalError) && (
                <p className="text-red-600 mb-2">{error || externalError}</p>
            )}
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium" htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block mb-1 font-medium" htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">{content.length} characters</p>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-medium" htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          {/* Scheduled Time */}
          {status === 'scheduled' && (
            <div>
              <label className="block mb-1 font-medium" htmlFor="scheduledTime">Scheduled Time</label>
              <input
                id="scheduledTime"
                type="datetime-local"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={status === 'scheduled'}
              />
            </div>
          )}

          {/* Platforms */}
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Platforms
  </label>
  <div className="space-y-2">
    {platforms.map((platform: any) => (
      <label key={platform.id} className="flex items-center">
        <input
          type="checkbox"
          value={platform.id}
          checked={selectedPlatformsIds.includes(platform.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedPlatformsIds([...selectedPlatformsIds, platform.id]);
            } else {
              setSelectedPlatformsIds(selectedPlatformsIds.filter(id => id !== platform.id));
            }
          }}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <span className="ml-2 text-gray-700">{platform.type}</span>
      </label>
    ))}
  </div>
</div>

          {/* {error && <p className="text-red-600">{error}</p>} */}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default EditPostModal;
