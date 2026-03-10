import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function CreatePost() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onEditorStateChange = (st) => setEditorState(st);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("cover", file);

    const res = await fetch(`${BASE}/api/uploads/cover`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const errorJson = await res.json();
      throw new Error(errorJson.error || errorJson.message || `Upload failed (${res.status})`);
    }

    const json = await res.json();
    const coverurl = json.secure_url || json.url || json.data?.secure_url;
    if (!coverurl) throw new Error("Upload succeeded but no URL returned");
    return coverurl;
  };

  const uploadImageCallBack = async (file) => {
    try {
      const url = await uploadFile(file);
      return { data: { link: url } };
    } catch (err) {
      return Promise.reject(err.message || "Image upload failed");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");

    const rawContent = convertToRaw(editorState.getCurrentContent());
    const html = draftToHtml(rawContent);
    const cleanHtml = DOMPurify.sanitize(html);