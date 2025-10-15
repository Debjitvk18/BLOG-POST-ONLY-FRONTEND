import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { mapPaginatedPosts } from '../utils/keyMapping';
import { Header } from '../components/Header';
import { PostCard } from '../components/PostCard';
import { ToggleView } from '../components/ToggleView';
import { Button } from '../components/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const OtherPost = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);

  // Helper to build full image URL
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  useEffect(() => {
    const fetchOtherPosts = async () => {
      setLoading(true);
      try {
        const response = await api.getOtherPosts(page);
        const mapped = mapPaginatedPosts(response);

        // Update imageUrl for each post
        const updatedPosts = mapped.posts.map((post) => ({
          ...post,
          imageUrl: getFullImageUrl(post.imageUrl),
        }));

        setPosts(updatedPosts);
        setTotalPages(mapped.totalPages);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherPosts();
  }, [page]);
 

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-[#18230F]">Other Users' Posts</h1>
          <ToggleView viewMode={viewMode} onToggle={setViewMode} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#255F38]"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No posts from other users found.</p>
          </div>
        ) : (
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
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Previous
                </Button>

                <span className="text-gray-700 font-medium">
                  Page {page} of {totalPages}
                </span>

                <Button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
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
    </div>
  );
};
