import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./grid.css";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch posts from the API when the component mounts
    async function fetchPosts() {
      try {
        const res = await fetch(`${BASE}/api/posts`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Calculate time ago from ISO date string
  const timeAgo = (iso) => {
    if (!iso) return "";
    const seconds = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo`;
    return `${Math.floor(months / 12)}y`;
  };

  // Animation variants for the container and cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: "easeOut" } },
  };

  // Filter posts based on the search query
  const filtered = posts.filter((p) => {
    if (!q) return true;
    const t = q.toLowerCase();
    return (p.title || "").toLowerCase().includes(t) || (p.summary || "").toLowerCase().includes(t) || (p.tags || []).join(" ").toLowerCase().includes(t);
  });

  if (loading)
    return (
      // Display loading message while posts are being fetched
      <div className="bw-grid-bg min-h-screen flex items-center justify-center p-8">
        <motion.p className="text-gray-300 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Loading posts...
        </motion.p>
      </div>
    );

  if (error)
    return (
      // Display error message if fetching posts fails
      <div className="bw-grid-bg min-h-screen flex items-center justify-center p-8">
        <motion.p className="text-red-400 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Error: {error}
        </motion.p>
      </div>
    );

  return (
    <div className="bw-grid-bg min-h-screen p-8">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">All Posts</h1>
            <p className="text-sm text-slate-300 mt-1">Browse the latest articles and guides — click a card to read more.</p>
          </div>
          <div className="w-full sm:w-72">
            <label className="sr-only">Search posts</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, summary or tags..."
              className="w-full rounded-lg px-3 py-2 bg-black/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
        {filtered.length === 0 ? (
          // Display message if no posts match the search query
          <div className="py-12 text-center text-slate-300">No posts found.</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {filtered.map((post) => {
              // Determine image source for the post
              const imgSrc = post.coverUrl ? (post.coverUrl.startsWith("http") ? post.coverUrl : `${BASE}${post.coverUrl}`) : null;
              return (
                <motion.article
                  key={post._id}
                  variants={cardVariants}
                  onClick={() => navigate(`/posts/${post.slug || post._id}`)}
                  tabIndex={0}
                  role="button"
                  className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg
                             border border-white/8 bg-black/40 backdrop-blur-sm
                             focus:outline-none focus:ring-4 focus:ring-sky-600/30 transition-all"
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700">
                    {imgSrc ? (
                      // Display post image if available
                      <img src={imgSrc} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      // Display placeholder if no image is available
                      <div className="w-full h-full flex items-center justify-center text-slate-400">📷 No Image</div>
                    )}
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/50 text-xs text-slate-100 backdrop-blur-sm">
                      {(post.tags && post.tags[0]) || "Post"}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg font-semibold text-white leading-tight">{post.title || "Untitled"}</h2>
                      <div className="text-xs text-slate-300">{post.createdAt ? `${timeAgo(post.createdAt)} ago` : ""}</div>
                    </div>
                    <p className="text-sm text-slate-300 mb-3 line-clamp-3">{post.summary || ""}</p>
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <div>By <span className="font-medium text-sky-300">{(post.author && (post.author.username || post.author.name)) || "Unknown"}</span></div>
                      <div className="flex gap-4 items-center">
                        <span className="flex items-center gap-1">👍 {post.likes || 0}</span>
                        <span className="flex items-center gap-1">💬 {post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}