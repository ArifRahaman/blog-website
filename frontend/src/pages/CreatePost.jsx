import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const UPLOAD_FAILED_MESSAGE = "Upload failed";
const IMAGE_UPLOAD_FAILED_MESSAGE = "Image upload failed";
const TITLE_REQUIRED_MESSAGE = "Title is required";

export default function CreatePost() {
  const navigate = useNavigate();
  const token = getToken();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onEditorStateChange = (st) => setEditorState(st);

  function getToken() {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  }

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("cover", file);

    try {
      const res = await fetch(`${BASE}/api/uploads/cover`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.error || errorJson.message || `${UPLOAD_FAILED_MESSAGE} (${res.status})`);
      }

      const json = await res.json();
      const coverurl = json.secure_url || json.url || json.data?.secure_url;
      if (!coverurl) throw new Error("Upload succeeded but no URL returned");
      return coverurl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const uploadImageCallBack = async (file) => {
    try {
      const url = await uploadFile(file);
      return { data: { link: url } };
    } catch (err) {
      return Promise.reject(err.message || IMAGE_UPLOAD_FAILED_MESSAGE);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error(TITLE_REQUIRED_MESSAGE);

    const rawContent = convertToRaw(editorState.getCurrentContent());
    const html = draftToHtml(rawContent);
    const cleanHtml = DOMPurify.sanitize(html);
  };
}
