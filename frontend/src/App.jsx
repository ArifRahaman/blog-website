import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./components/auth/Signup"; // Component for user signup
import Login from "./components/auth/Login"; // Component for user login
import AuthProvider from "./components/AuthContext"; // Context provider for authentication
import ProtectedRoute from "./components/ProtectedRoute"; // Component to protect routes
import CreatePost from "./pages/CreatePost"; // Page for creating a post
import PostsList from "./components/posts/PostList"; // Component to list all posts
import Navbar from "./components/ui/Navbar"; // Navigation bar component
import PostView from "./components/posts/PostView"; // Component to view a single post
import Profile from "./pages/Profile"; // User profile page
import Chatai from "./components/chatai/Chatai"; // ChatAI component
import HomePage from "./pages/Home"; // Home page component

export default function App() {
  return (
    // Providing authentication context to the entire app
    <AuthProvider>
      {/* ToastContainer for displaying notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <BrowserRouter>
        {/* Navigation bar displayed on all pages */}
        <Navbar />
        <main className="p-0 pt-16">
          <Routes>
            {/* Route for signup page */}
            <Route path="/signup" element={<Signup />} />
            {/* Route for login page */}
            <Route path="/login" element={<Login />} />
            {/* Protected route for creating a post */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            {/* Protected route for displaying posts list */}
            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <PostsList />
                </ProtectedRoute>
              }
            />
            {/* Default route directing to home page */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            {/* Protected route for ChatAI feature */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chatai />
                </ProtectedRoute>
              }
            />
            {/* Protected route for viewing a single post specified by a slug */}
            <Route
              path="/posts/:slug"
              element={
                <ProtectedRoute>
                  <PostView />
                </ProtectedRoute>
              }
            />
            {/* Protected route for user profile page */}
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