import React from "react";
import { Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PostCard = ({
  post,
  viewMode,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl.trim() === "") return null;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    return `http://localhost:5000${imageUrl}`;
  };

  const imageUrl = getImageUrl(post.imageUrl);

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col md:flex-row">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={post.title}
            className="md:w-64 h-48 md:h-auto object-contain bg-gray-100 cursor-pointer"
            onClick={handleCardClick}
          />
        )}
        <div className="flex-1 p-6">
          <h3
            className="text-2xl font-bold text-[#18230F] mb-2 cursor-pointer hover:text-[#255F38] transition-colors"
            onClick={handleCardClick}
          >
            {post.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>{post.username}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
          <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
          {showActions && (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="px-4 py-2 bg-[#255F38] text-white rounded-lg hover:bg-[#1F7D53] transition-colors"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid / Default view
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-48 object-contain bg-gray-100 cursor-pointer"
          onClick={handleCardClick}
        />
      )}
      <div className="p-4">
        <h3
          className="text-xl font-bold text-[#18230F] mb-2 cursor-pointer hover:text-[#255F38] transition-colors line-clamp-2"
          onClick={handleCardClick}
        >
          {post.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{post.username || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {post.content}
        </p>
        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="flex-1 px-3 py-2 bg-[#255F38] text-white text-sm rounded-lg hover:bg-[#1F7D53] transition-colors"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
