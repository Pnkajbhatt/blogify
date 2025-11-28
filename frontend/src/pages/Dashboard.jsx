import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { FaPlus, FaEdit, FaTrash, FaEye, FaHeart } from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's posts
      const response = await api.get("/api/post", {
        params: { author: user._id },
      });

      const userPosts = response.data.data || [];
      setPosts(userPosts);

      // Calculate stats
      const totalLikes = userPosts.reduce(
        (sum, post) => sum + (post.likes?.length || 0),
        0
      );
      const totalViews = userPosts.reduce(
        (sum, post) => sum + (post.views || 0),
        0
      );

      setStats({
        totalPosts: userPosts.length,
        totalLikes,
        totalViews,
      });
    } catch (err) {
      console.error("Fetch dashboard error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await api.delete(`/api/post/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
      setStats((prev) => ({
        ...prev,
        totalPosts: prev.totalPosts - 1,
      }));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete post");
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
          </div>
          <Link
            to="/post/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <FaPlus />
            Create New Post
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Posts</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalPosts}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaEdit className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Likes</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalLikes}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaHeart className="text-red-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalViews}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaEye className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Posts</h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <Link
                      to={`/post/${post._id}`}
                      className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                    >
                      {post.title}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()} •{" "}
                      {post.likes?.length || 0} likes • {post.views || 0} views
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
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

                  <div className="flex gap-2 ml-4">
                    <Link
                      to={`/post/${post._id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      View
                    </Link>
                    <Link
                      to={`/post/edit/${post._id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                You haven't created any posts yet
              </p>
              <Link
                to="/post/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FaPlus />
                Create Your First Post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
