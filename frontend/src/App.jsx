import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./components/auth/Signup"; // Component for user signup
import Login from "./components/auth/Login"; // Component for user login
import AuthProvider from "./components/AuthContext"; // Context provider for authentication
import ProtectedRoute from "./components/ProtectedRoute"; // Component to protect routes for authenticated users
import CreatePost from "./pages/CreatePost"; // Page component for creating a post
import PostsList from "./components/posts/PostList"; // Component to list all posts
import Navbar from "./components/ui/Navbar"; // Navbar component for navigation
import PostView from "./components/posts/PostView"; // Component to view a single post detail
import Profile from "./pages/Profile"; // Page component for user profile
import Chatai from "./components/chatai/Chatai"; // Component for chat AI feature
import HomePage from "./pages/Home"; // Home page component

export default function App() {
  return (
    <AuthProvider> {/* Provides authentication context to child components */}
      <ToastContainer
        position="top-right" // Position of the toast notifications
        autoClose={3000} // Auto close duration for each toast
        hideProgressBar={false} // Show or hide progress bar in toast
        newestOnTop={true} // Display newest toast on top
        closeOnClick // Allow closing toast on click
        pauseOnHover // Pause auto close on hover
        draggable // Allow toast to be draggable
        theme="colored" // Theme of the toast notifications
      />

      <BrowserRouter> {/* Wraps application in router context */}
        <Navbar /> {/* Renders navigation bar */}
        <main className="p-0 pt-16"> {/* Main content area with padding */}
          <Routes>
            <Route path="/signup" element={<Signup />} /> {/* Route for signup page */}
            <Route path="/login" element={<Login />} /> {/* Route for login page */}
            {/* Protected route for creating a post, accessible only to authenticated users */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            {/* Protected route for viewing posts list, accessible only to authenticated users */}
            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <PostsList />
                </ProtectedRoute>
              }
            />
            {/* Protected route for home page, accessible only to authenticated users */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            {/* Protected route for chat AI feature, accessible only to authenticated users */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chatai />
                </ProtectedRoute>
              }
            />
            {/* Protected route for viewing a specific post by slug, accessible only to authenticated users */}
            <Route
              path="/posts/:slug"
              element={
                <ProtectedRoute>
                  <PostView />
                </ProtectedRoute>
              }
            />
            {/* Protected route for user's profile page, accessible only to authenticated users */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}