import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import AuthProvider from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePost from "./pages/CreatePost";
import PostsList from "./components/posts/PostList";
import Navbar from "./components/ui/Navbar";
import PostView from "./components/posts/PostView";
import Profile from "./pages/Profile";
import Chatai from "./components/chatai/Chatai";
import HomePage from "./pages/Home";

export default function App() {
  return (
    // Wrap the application with AuthProvider to manage authentication state
    <AuthProvider>
      {/* Configure ToastContainer for displaying toast notifications */}
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

      {/* Set up routing for the application */}
      <BrowserRouter>
        {/* Include the Navbar component */}
        <Navbar />
        <main className="p-0 pt-16">
          <Routes>
            {/* Define route for Signup page */}
            <Route path="/signup" element={<Signup />} />
            {/* Define route for Login page */}
            <Route path="/login" element={<Login />} />
            {/* Define protected route for CreatePost page */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            {/* Define protected route for PostsList page */}
            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <PostsList />
                </ProtectedRoute>
              }
            />
            {/* Define protected route for HomePage */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            {/* Define protected route for Chatai page */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chatai />
                </ProtectedRoute>
              }
            />
            {/* Define protected route for viewing individual posts */}
            <Route
              path="/posts/:slug"
              element={
                <ProtectedRoute>
                  <PostView />
                </ProtectedRoute>
              }
            />
            {/* Define protected route for Profile page */}
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