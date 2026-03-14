import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function Avatar({ src, alt, size = 120 }) {
  const url = !src || src === "" ? null : src.startsWith("http") ? src : `${BASE_URL}${src}`;
  return (
    <div
      className="rounded-full bg-gray-100/30 overflow-hidden flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {url ? (
        <img src={url} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-3xl text-gray-300 font-semibold">
          {alt?.[0]?.toUpperCase() || "U"}
        </span>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse p-6 rounded-lg">
      <div className="h-6 w-1/3 bg-gray-300/30 mb-4 rounded"></div>
      <div className="h-40 bg-gray-300/30 rounded mb-4"></div>
      <div className="h-4 bg-gray-300/30 rounded mb-2"></div>
      <div className="h-4 bg-gray-300/30 rounded w-5/6"></div>
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [followersUsers, setFollowersUsers] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  const fileRef = useRef();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUserAndRelated() {
      setLoadingUser(true);
      if (!token) {
        toast.error("You must be logged in");
        setLoadingUser(false);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || `Failed to fetch user (status ${res.status})`);
        }
        const data = await res.json();
        setUser(data);

        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          setLoadingPosts(true);
          try {
            let pRes = await fetch(`${BASE_URL}/api/posts?userId=${data._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!pRes.ok) {
              pRes = await fetch(`${BASE_URL}/api/posts/author/${data._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
            }
            if (pRes.ok) {
              const pJson = await pRes.json().catch(() => ({}));
              const allPosts = Array.isArray(pJson) ? pJson : pJson.posts || [];
              const myPosts = allPosts.filter((p) => {
                const authorId = p.author?._id || p.author || p.user || p.userId || p.owner || p.creator;
                return authorId && String(authorId) === String(data._id);
              });
              setPosts(myPosts);
            }
          } catch (e) {
            console.error("Failed to fetch posts:", e);
          } finally {
            setLoadingPosts(false);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Could not load profile");
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUserAndRelated();
  }, [token]);

  async function resolveUserObjectsFromResponse(respJson, fallbackIdsKey = null) {
    if (Array.isArray(respJson) && respJson.length > 0 && typeof respJson[0] === "object" && (respJson[0]._id || respJson[0].username)) {
      return respJson;
    }

    if (respJson && Array.isArray(respJson.followers) && typeof respJson.followers[0] === "object") {
      return respJson.followers;
    }

    if (respJson && Array.isArray(respJson.followers) && (typeof respJson.followers[0] === "string" || typeof respJson.followers[0] === "number")) {
      return await fetchUsersByIds(respJson.followers);
    }

    if (Array.isArray(respJson) && respJson.length > 0 && (typeof respJson[0] === "string" || typeof respJson[0] === "number")) {
      return await fetchUsersByIds(respJson);
    }

    if (respJson && fallbackIdsKey && Array.isArray(respJson[fallbackIdsKey])) {
      return await fetchUsersByIds(respJson[fallbackIdsKey]);
    }

    return [];
  }

  async function fetchUsersByIds(ids = []) {
    if (!ids || ids.length === 0) return [];
    try {
      const idsParam = ids.map(String).join(",");
      const res = await fetch(`${BASE_URL}/api/users?ids=${encodeURIComponent(idsParam)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) return json;
        if (Array.isArray(json.users)) return json.users;
      }

      const promises = ids.map((id) =>
        fetch(`${BASE_URL}/api/users/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
          .then((r) => (r.ok ? r.json().catch(() => null) : null))
          .catch(() => null)
      );
      const results = await Promise.all(promises);
      return results.filter(Boolean);
    } catch (err) {
      console.warn("fetchUsersByIds failed", err);
      return [];
    }
  }

  async function openFollowers() {
    if (!user) return;
    setLoadingFollowers(true);
    try {
      let res = await fetch(`${BASE_URL}/api/users/${user._id}/followers`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        res = await fetch(`${BASE_URL}/api/users/${user._id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      }

      if (!res.ok) {
        const meRes = await fetch(`${BASE_URL}/api/auth/me`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (meRes.ok) {
          const meJson = await meRes.json().catch(() => ({}));
          if (meJson && String(meJson._id) === String(user._id)) {
            const resolved = await resolveUserObjectsFromResponse(meJson);
            setFollowersUsers(resolved);
            setShowFollowersModal(true);
            return;
          }
        }
        throw new Error("Could not fetch followers");
      }

      const json = await res.json().catch(() => ({}));
      const resolved = await resolveUserObjectsFromResponse(json, "followers");
      setFollowersUsers(resolved);
      setShowFollowersModal(true);
    } catch (err) {
      console.error("openFollowers error", err);
      toast.error(err.message || "Could not load followers");
    } finally {
      setLoadingFollowers(false);
    }
  }

  async function openFollowing() {
    if (!user) return;
    setLoadingFollowing(true);
    try {
      let res = await fetch(`${BASE_URL}/api/users/${user._id}/following`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        res = await fetch(`${BASE_URL}/api/users/${user._id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      }
      if (!res.ok) {
        throw new Error("Could not fetch following");
      }
      const json = await res.json().catch(() => ({}));
      const resolved = await resolveUserObjectsFromResponse(json, "following");
      setFollowingUsers(resolved);
      setShowFollowingModal(true);
    } catch (err) {
      console.error("openFollowing error", err);
      toast.error(err.message || "Could not load following");
    } finally {
      setLoadingFollowing(false);
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);

      const res = await fetch(`${BASE_URL}/api/auth/me/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Avatar upload failed");
      }
      const json = await res.json();
      setUser((prev) => ({ ...prev, avatarUrl: json.avatarUrl || json.url || prev.avatarUrl }));
      toast.success("Avatar updated");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleProfileSave = async (updates) => {
    if (!token) return toast.error("You must be logged in");
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Update failed");
      }
      const json = await res.json();
      setUser(json);
      setEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Update failed");
    }
  };

  if (loadingUser)
    return (
      <div className="bw-grid-bg min-h-screen p-8 flex items-center justify-center">
        <SkeletonCard />
      </div>
    );

  if (!user)
    return (
      <div className="bw-grid-bg min-h-screen p-8 flex items-center justify-center">
        <p className="text-center text-red-400">Failed to load profile. Please login.</p>
      </div>
    );

  return (
    <div className="bw-grid-bg min-h-screen p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-1 gap-8 text-blue-900">
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex flex-col items-center">
              <Avatar src={user.avatarUrl} alt={user.username} size={140} />
              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold">{user.username}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <label className="inline-flex items-center gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={uploading}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm hover:bg-sky-700"
                  >
                    {uploading ? "Uploading..." : "Change Avatar"}
                  </button>
                </label>

                <button
                  onClick={() => setEditing(true)}
                  className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50"
                >
                  Edit Profile
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-600 text-center">{user.bio || "No bio yet — tell people about yourself!"}</p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-lg font-semibold">{posts?.length || 0}</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <button onClick={openFollowers} className="p-3 bg-gray-50 rounded">
                <div className="text-lg font-semibold">{(user.followers && user.followers.length) ?? (followersUsers.length || 0)}</div>
                <div className="text-xs text-gray-500">Followers</div>
              </button>
              <button onClick={openFollowing} className="p-3 bg-gray-50 rounded">
                <div className="text-lg font-semibold">{(user.following && user.following.length) ?? (followingUsers.length || 0)}</div>
                <div className="text-xs text-gray-500">Following</div>
              </button>
            </div>

            {user.badges?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((b, i) => (
                    <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">{b}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-4xl font-semibold text-green">Recent Posts</h3>
            <div className="text-4xl text-gray-500">{posts?.length || 0} posts</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loadingPosts ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-44 bg-white rounded-lg shadow p-4 animate-pulse" />
              ))
            ) : posts.length === 0 ? (
              <div className="col-span-full p-6 bg-white rounded-lg shadow text-center text-gray-500">
                No posts yet — create your first post!
              </div>
            ) : (
              posts.map((p) => (
                <article key={p._id} className="bg-white rounded-lg shadow overflow-hidden">
                  {p.coverUrl ? (
                    <img
                      src={p.coverUrl.startsWith("http") ? p.coverUrl : `${BASE_URL}${p.coverUrl}`}
                      alt={p.title}
                      className="w-full h-36 object-cover"
                    />
                  ) : (
                    <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-sm mb-1 truncate">{p.title}</h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{p.summary || "—"}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      <span>💬 {p.comments?.length || 0} • 👍 {p.likes || 0}</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      {editing && <EditModal user={user} onClose={() => setEditing(false)} onSave={handleProfileSave} />}

      {showFollowersModal && (
        <UsersModal
          title="Followers"
          users={followersUsers}
          loading={loadingFollowers}
          onClose={() => setShowFollowersModal(false)}
        />
      )}

      {showFollowingModal && (
        <UsersModal
          title="Following"
          users={followingUsers}
          loading={loadingFollowing}
          onClose={() => setShowFollowingModal(false)}
        />
      )}
    </div>
  );
}

function EditModal({ user, onClose, onSave }) {
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [bio, setBio] = useState(user.bio || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ username, email, bio });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close edit profile modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className