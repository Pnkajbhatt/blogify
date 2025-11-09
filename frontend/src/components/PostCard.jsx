import React from "react";

function PostCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.images && post.images.length > 0 && (
        <img
          src={post.images[0]}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {post.title}
        </h2>
        <p className="text-gray-600 text-sm mb-3">
          by {post.author?.username || "Anonymous"} • {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-700 mb-4 line-clamp-3">
          {post.content.substring(0, 150)}
          {post.content.length > 150 && "..."}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {post.likes?.length || 0} likes
            </span>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Read More →
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
