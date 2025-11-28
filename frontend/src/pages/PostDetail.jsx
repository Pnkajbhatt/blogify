import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import api from "../services/api";
import {
  FaHeart,
  FaRegHeart,
  FaEdit,
  FaTrash,
  FaCalendar,
  FaUser,
} from "react-icons/fa";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/api/post/${id}`);
      setPost(response.data.data);
    } catch (err) {
      console.error("Fetch post error:", err);
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsLiking(true);
    try {
      const response = await api.put(`/api/post/${id}/like`);
      setPost(response.data.data);
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/api/post/${id}`);
      navigate("/");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">
            {error || "Post not found"}
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isAuthor = user?._id === post.author?._id;
  const isLiked = post.likes?.some((like) => like.user._id === user?._id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          {post.images && post.images.length > 0 && (
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-gray-600 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <FaUser className="text-blue-600" />
                <span className="font-medium">
                  {post.author?.username || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="text-blue-600" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-4">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    isLiked
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50`}
                >
                  {isLiked ? <FaHeart /> : <FaRegHeart />}
                  <span>{post.likes?.length || 0} Likes</span>
                </button>
              </div>

              {/* Author Actions */}
              {isAuthor && (
                <div className="flex gap-3">
                  <Link
                    to={`/post/edit/${post._id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <FaEdit />
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                  >
                    <FaTrash />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to all posts
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
