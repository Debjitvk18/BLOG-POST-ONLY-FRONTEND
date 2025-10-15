import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { api } from '../utils/api';
import { mapPostToFrontend } from '../utils/keyMapping';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Post ID not provided');
        setLoading(false);
        return;
      }

      try {
        const response = await api.getPost(id);
        const mappedPost = mapPostToFrontend(response);
        setPost(mappedPost);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl.trim() === '') return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return `http://localhost:5000${imageUrl}`;
  };
  // console.log(getImageUrl)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#255F38]"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error || 'Post not found'}
          </div>
          <Button onClick={() => navigate('/feed')} variant="outline">
            <ArrowLeft size={20} className="inline mr-2" />
            Back to Feed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft size={20} className="inline mr-2" />
          Back
        </Button>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {getImageUrl(post.imageUrl) && (
            <div
              className="w-full h-96 bg-cover bg-center"
              style={{ backgroundImage: `url(${getImageUrl(post.imageUrl)})` }}
            />
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold text-[#18230F] mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-600 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <User size={20} />
                <span className="font-medium">{post.username || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Last updated: {formatDate(post.updatedAt)}
                </p>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
};
