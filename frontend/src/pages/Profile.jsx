import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { FaEdit, FaEnvelope, FaCalendar } from "react-icons/fa";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // If no ID provided, show current user's profile
  const profileId = id || currentUser?._id;
  const isOwnProfile = currentUser?._id === profileId;

  useEffect(() => {
    if (profileId) {
      fetchProfileData();
    } else {
      navigate("/login");
    }
  }, [profileId]);

  const fetchProfileData = async () => {
    try {
      // Fetch user profile
      const userResponse = await api.get(`/api/auth/me`);
      setProfile(userResponse.data.data);

      // Fetch user's posts
      const postsResponse = await api.get("/api/post", {
        params: { author: profileId },
      });
      setPosts(postsResponse.data.data || []);
    } catch (err) {
      console.error("Fetch profile error:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">
            {error || "Profile not found"}
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              {/* Avatar */}
              <div className="shrink-0">
                <img
                  src={profile.avatar || "https://via.placeholder.com/150"}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {profile.name}
                </h1>

                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <FaEnvelope className="text-blue-600" />
                  <span>{profile.email}</span>
                </div>

                {profile.bio && (
                  <p className="text-gray-700 mb-4">{profile.bio}</p>
                )}

                {/* Tech Stack */}
                {profile.techStack && profile.techStack.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex gap-6 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-800">
                      {posts.length}
                    </span>{" "}
                    Posts
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">
                      {profile.followers?.length || 0}
                    </span>{" "}
                    Followers
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">
                      {profile.following?.length || 0}
                    </span>{" "}
                    Following
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button (only for own profile) */}
            {isOwnProfile && (
              <Link
                to="/profile/edit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FaEdit />
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* User's Posts */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isOwnProfile ? "My Posts" : `${profile.name}'s Posts`}
          </h2>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              {isOwnProfile
                ? "You haven't created any posts yet"
                : "No posts yet"}
            </p>
            {isOwnProfile && (
              <Link
                to="/post/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Your First Post
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
