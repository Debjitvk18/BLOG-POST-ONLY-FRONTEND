import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { PostCard } from '../components/PostCard';
import { ToggleView } from '../components/ToggleView';
import { Button } from '../components/Button';
import { api } from '../utils/api';
import { mapPostsToFrontend } from '../utils/keyMapping';
import { User, PlusCircle } from 'lucide-react';
import { CreatePostModal } from '../components/CreatePostModal';
import { EditPostModal } from '../components/EditPostModal';

export const Profile = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchUserPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getMyPosts(1);
      const mappedPosts = mapPostsToFrontend(response.posts || response);
      setPosts(mappedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.deletePost(postId);
      fetchUserPosts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const handlePostCreated = () => {
    setShowCreateModal(false);
    fetchUserPosts();
  };

  const handlePostUpdated = () => {
    setShowEditModal(false);
    setSelectedPost(null);
    fetchUserPosts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-[#18230F] to-[#27391C] rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#255F38] p-4 rounded-full">
              <User size={48} />
            </div>
            <div>
              <h1 className="text-4xl font-bold">My Profile</h1>
              <p className="text-gray-300 mt-1">{posts.length} posts</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#18230F] mb-2">My Posts</h2>
            <p className="text-gray-600">Manage your posts</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Create Post
            </Button>
            <ToggleView viewMode={viewMode} onToggle={setViewMode} />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#255F38]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">You haven't created any posts yet.</p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Your First Post
            </Button>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-6'
            }
          >
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                viewMode={viewMode}
                showActions={true}
                onEdit={() => handleEdit(post)}
                onDelete={() => handleDelete(post.id)}
              />
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handlePostCreated}
        />
      )}

      {showEditModal && selectedPost && (
        <EditPostModal
          post={selectedPost}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPost(null);
          }}
          onSuccess={handlePostUpdated}
        />
      )}
    </div>
  );
};
