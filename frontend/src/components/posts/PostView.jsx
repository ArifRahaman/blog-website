import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const LOCAL_STORAGE_TOKEN_KEY = "token";
const LOCAL_STORAGE_USER_KEY = "user";
const LOCAL_STORAGE_ID_KEY = "id";

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  const headers = token ? { Authorization: `Bearer ${token}`, ...options.headers } : options.headers;
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${response.status}`);
  }
  return response.json();
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY) || "null");
  } catch {
    return null;
  }
};

const getCurrentUserId = () => {
  const storedUser = getStoredUser();
  return (storedUser && (storedUser._id || storedUser.id)) || localStorage.getItem(LOCAL_STORAGE_ID_KEY) || null;
};

const getAuthorId = (author) => {
  if (!author) return null;
  return typeof author === "string" ? author : author._id || author.id || null;
};

const resolveImageUrl = (url) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
};

const usePostData = (slug, token, currentUserId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWithAuth(`${API_BASE_URL}/api/posts/${encodeURIComponent(slug)}`);
        setPost(data);
        setLikes(Number(data.likes || 0));
        setComments(Array.isArray(data.comments) ? data.comments : []);
        const author = data.author || {};
        const fc = Array.isArray(author.followers) ? author.followers.length : author.followersCount || author.followerCount || 0;
        setFollowerCount(fc);
        setIsFollowing(currentUserId ? author.followers.map(String).includes(String(currentUserId)) : false);
      } catch (err) {
        console.error("fetchPost error:", err);
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug, token, currentUserId]);

  return { post, loading, error, likes, comments, isFollowing, followerCount, setPost, setLikes, setComments, setIsFollowing, setFollowerCount };
};

const useAuthorFollowers = (post, token, currentUserId, setPost, setFollowerCount, setIsFollowing) => {
  useEffect(() => {
    if (!post) return;

    const authorId = getAuthorId(post.author);
    const authorUsername = post.author && (post.author.username || post.author.name);

    const fetchFollowersForAuthor = async () => {
      const attempts = [];
      if (authorId) attempts.push(`${API_BASE_URL}/api/users/${authorId}/followers`);
      if (authorUsername) attempts.push(`${API_BASE_URL}/api/users/${authorUsername}/followers`);
      if (authorId) attempts.push(`${API_BASE_URL}/api/users/${authorId}`);

      let got = false;
      for (const url of attempts) {
        try {
          const json = await fetchWithAuth(url);
          if (Array.isArray(json)) {
            setFollowerCount(json.length);
            setIsFollowing(Boolean(currentUserId) && json.map(String).includes(String(currentUserId)));
            got = true;
            break;
          }
          if (json && Array.isArray(json.followers)) {
            setFollowerCount(json.followers.length);
            setIsFollowing(Boolean(currentUserId) && json.followers.map(String).includes(String(currentUserId)));
            if (json._id || json.username) {
              setPost((p) => (p ? { ...p, author: { ...p.author, ...json } } : p));
            }
            got = true;
            break;
          }
          if (json && (json._id || json.username) && (json.followers || typeof json.followersCount !== "undefined")) {
            const count = Array.isArray(json.followers) ? json.followers.length : json.followersCount ?? json.followerCount ?? 0;
            setFollowerCount(count);
            if (Array.isArray(json.followers)) {
              setIsFollowing(json.followers.map(String).includes(String(currentUserId)));
            }
            setPost((p) => (p ? { ...p, author: { ...p.author, ...json } } : p));
            got = true;
            break;
          }
        } catch (err) {
          console.warn("fetch followers attempt failed for", url, err);
        }
      }

      if (!got) {
        console.warn("Could not fetch followers for author", authorId || authorUsername);
      }
    };

    fetchFollowersForAuthor();
  }, [post, token, currentUserId, setPost, setFollowerCount, setIsFollowing]);
};

const PostView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  const currentUserId = getCurrentUserId();

  const {
    post,
    loading,
    error,
    likes,
    comments,
    isFollowing,
    followerCount,
    setPost,
    setLikes,
    setComments,
    setIsFollowing,
    setFollowerCount,
  } = usePostData(slug, token, currentUserId);

  useAuthorFollowers(post, token, currentUserId, setPost, setFollowerCount, setIsFollowing);

  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState(false);
  const [followProcessing, setFollowProcessing] = useState(false);

  const handleFollow = async () => {
    if (!token) {
      toast.error("Please log in to follow users");
      return;
    }

    const authorId = getAuthorId(post?.author);
    if (!authorId) {
      toast.error("Author not found");
      return;
    }

    if (currentUserId && String(currentUserId) === String(authorId)) {
      toast.error("You cannot follow yourself");
      return;
    }

    if (followProcessing) return;
    setFollowProcessing(true);

    const prevFollowing = isFollowing;
    const prevCount = followerCount;
    setIsFollowing(!prevFollowing);
    setFollowerCount((c) => (prevFollowing ? Math.max(0, c - 1) : c + 1));

    try {
      const body = await fetchWithAuth(`${API_BASE_URL}/api/users/${authorId}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (typeof body.followerCount !== "undefined") setFollowerCount(Number(body.followerCount));
      if (typeof body.isFollowing === "boolean") setIsFollowing(body.isFollowing);

      if (body.author) {
        setPost((p) => (p ? { ...p, author: { ...p.author, ...body.author } } : p));
        if (Array.isArray(body.author.followers)) {
          setFollowerCount(body.author.followers.length);
          setIsFollowing(body.author.followers.map(String).includes(String(currentUserId)));
        }
      } else if (Array.isArray(body.followers)) {
        setFollowerCount(body.followers.length);
        setIsFollowing(body.followers.map(String).includes(String(currentUserId)));
      } else {
        const updatedPost = await fetchWithAuth(`${API_BASE_URL}/api/posts/${encodeURIComponent(slug)}`);
        setPost(updatedPost);
        const a = updatedPost.author || {};
        if (Array.isArray(a.followers)) {
          setFollowerCount(a.followers.length);
          setIsFollowing(a.followers.map(String).includes(String(currentUserId)));
        } else {
          setFollowerCount(a.followersCount ?? a.followerCount ?? prevCount);
        }
      }

      toast.success(body.message || (prevFollowing ? "Unfollowed" : "Followed"));
    } catch (err) {
      console.error("follow error:", err);
      setIsFollowing(prevFollowing);
      setFollowerCount(prevCount);
      toast.error(err.message || "Failed to update follow status");
    } finally {
      setFollowProcessing(false);
    }
  };

  const handleLike = async () => {
    if (!token) {
      toast.error("Please log in to like posts");
      return;
    }
    if (!post?._id) return;

    if (likeProcessing) return;
    setLikeProcessing(true);

    try {
      const json = await fetchWithAuth(`${API_BASE_URL}/api/posts/${post._id}/like`, {
        method: "POST",
      });

      const newLikes = Number(json.likes ?? likes);
      setLikes(newLikes);
      setPost((p) => (p ? { ...p, likes: newLikes } : p));
    } catch (err) {
      console.error("handleLike error:", err);
      toast.error(err.message || "Error toggling like");
    } finally {
      setLikeProcessing(false);
    }
  };

  const handleAddComment = async (e) => {
    e?.preventDefault?.();
    if (!token) {
      toast.error("Please login");
      return;
    }
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    if (!post?._id) return;

    setCommentSubmitting(true);
    try {
      const createdComment = await fetchWithAuth(`${API_BASE_URL}/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText.trim() }),
      });

      setComments((prev) => [...prev, createdComment]);
      setCommentText("");
      toast.success("Comment added");
    } catch (err) {
      console.error("handleAddComment error:", err);
      toast.error(err.message || "Failed to add comment");
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-center text-gray-500">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600">No post to show.</p>
      </div>
    );
  }

  const cover = resolveImageUrl(post.coverUrl);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-600 mb-4 inline-flex items-center hover:text-gray-800 transition"
      >
        ← Back
      </button>

      <article className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            <div className="text-sm text-gray-500 mt-1">
              By{" "}
              <span className="font-medium text-blue-600">
                {(post.author && (post.author.username || post.author.name)) || post.author || "Unknown"}
              </span>{" "}
              • {new Date(post.createdAt).toLocaleDateString()}
            </div>

            <div className="text-sm text-gray-500 mt-2">
              Followers:{" "}
              <span
                className="font-medium text-gray-700 cursor-pointer"
                title="Click to view followers (not implemented)"
              >
                {followerCount ?? 0}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(() => {
              const authorId = getAuthorId(post.author);
              const showFollow = currentUserId && authorId && String(currentUserId) !== String(authorId);
              if (!showFollow) {
                return null;
              }

              return (
                <button
                  onClick={handleFollow}
                  disabled={followProcessing}
                  aria-pressed={isFollowing}
                  className={`px-4 py-2 rounded-lg font-semibold transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-300
                    ${isFollowing ? "bg-white text-gray-800 border border-gray-200 shadow-sm" : "bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"}`}
                  title={isFollowing ? "Unfollow user" : "Follow user"}
                >
                  {followProcessing ? "..." : isFollowing ? "Unfollow" : "Follow"}
                </button>
              );
            })()}
          </div>
        </header>

        {cover && (
          <img
            src={cover}
            alt={post.title}
            className="w-full h-80 object-cover rounded-xl mb-6 shadow-sm"
          />
        )}

        <div
          className="prose prose-lg max-w-none mb-6 text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={likeProcessing}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-white shadow-sm transition ${
                likeProcessing ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              👍 {likeProcessing ? "Liking..." : "Like"}
            </button>
            <span className="text-sm text-gray-700">👍 {likes}</span>
            <span className="text-sm text-gray-700">💬 {comments.length}</span>
          </div>
          <div className="text-sm text-gray-500">
            Tags: {post.tags?.length ? post.tags.join(", ") : "None"}
          </div>
        </div>

        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>

          {comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet — be the first!</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((c) => {
                const username =
                  (c.user && typeof c.user === "object" && c.user.username) ||
                  (typeof c.user === "string" && c.user) ||
                  (c.author && c.author.username) ||
                  "Unknown";

                return (
                  <li key={c._id || c.id} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-800">{username}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(c.date || c.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{c.text}</p>
                  </li>
                );
              })}
            </ul>
          )}

          <form onSubmit={handleAddComment} className="mt-6 bg-gray-50 p-4 rounded-lg border">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              placeholder="Write a thoughtful comment..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={commentSubmitting}
            />
            <div className="flex justify-end gap-3 mt-3">
              <button
                type="button"
                onClick={() => setCommentText("")}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                disabled={commentSubmitting}
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                disabled={commentSubmitting}
              >
                {commentSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        </section>
      </article>
    </div>
  );
};

export default PostView;