export const mapPostToFrontend = (post) => {
  return {
    id: post.id,
    title: post.title || '',
    content: post.content || '',
    imageUrl: post.image || '',
    userId: post.user_id,
    username: post.username || 'Unknown User',
    createdAt: post.created_at,
    updatedAt: post.updated_at || post.created_at,
  };
};

export const mapPostsToFrontend = (posts) => {
  if (!Array.isArray(posts)) return [];
  return posts.map(mapPostToFrontend);
};

export const mapPaginatedPosts = (response) => {
  if (!response || !response.posts) {
    return { posts: [], total: 0, page: 1, totalPages: 1 };
  }

  return {
    posts: mapPostsToFrontend(response.posts),
    total: response.total || 0,
    page: response.page || 1,
    totalPages: response.totalPages || 1,
  };
};
