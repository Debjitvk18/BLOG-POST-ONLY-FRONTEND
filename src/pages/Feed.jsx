import React, { useState } from 'react';
import { Header } from '../components/Header';
import { PostCard } from '../components/PostCard';
import { ToggleView } from '../components/ToggleView';
import { Button } from '../components/Button';
import { usePosts } from '../hooks/usePosts';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { CreatePostModal } from '../components/CreatePostModal';

export const Feed = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { posts, loading, error, totalPages, refetch } = usePosts(currentPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePostCreated = () => {
    setShowCreateModal(false);
    setCurrentPage(1);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#18230F] mb-2">Post Feed</h1>
            <p className="text-gray-600">
              Showing {posts.length} posts {totalPages > 1 && `(Page ${currentPage} of ${totalPages})`}
            </p>
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
            <p className="text-gray-500 text-lg">No posts found. Create your first post!</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-6'
              }
            >
              {posts.map((post) => (
                <PostCard key={post.id} post={post} viewMode={viewMode} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Previous
                </Button>

                <span className="text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handlePostCreated}
        />
      )}
    </div>
  );
};