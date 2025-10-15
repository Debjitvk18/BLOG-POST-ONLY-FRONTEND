import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { mapPostsToFrontend } from '../utils/keyMapping';

export const usePosts = (page = 1) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = async (pageNum) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getPaginatedPosts(pageNum);
      const mappedPosts = mapPostsToFrontend(response.posts);
      setPosts(mappedPosts);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalPosts(response.totalPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const refetch = () => {
    fetchPosts(currentPage);
  };

  return {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalPosts,
    refetch,
    fetchPosts,
  };
};
