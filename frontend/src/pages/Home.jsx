import React, { useEffect } from "react";
import { usePostStore } from "../store/usePostStore.js";
import PostCard from "../components/PostCard.jsx";

function Home() {
  const { posts, loading, fetchPost } = usePostStore();

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Home;
