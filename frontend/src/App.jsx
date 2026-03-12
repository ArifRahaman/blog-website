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
    <AuthProvider>  {/* Provides authentication context to the entire app */}
      <ToastContainer
        position="top-right"  {/* Toast messages appear in top-right corner */}
        autoClose={3000}  {/* Toast messages close automatically after 3 seconds */}
        hideProgressBar={false}  {/* Displays progress bar on toast messages */}
        newestOnTop={true}  {/* New toast messages will be added on top */}
        closeOnClick  {/* Allows to close the toast by clicking on it */}
        pauseOnHover  {/* Pauses the auto-close timer if hovered */}
        draggable  {/* Enables dragging of toast messages */}
        theme="colored"  {/* Applies colored theme to toast messages */}
      />

      <BrowserRouter>  {/* Manages navigation and routing for the app */}
        <Navbar />  {/* Displays the navigation bar at the top */}
        <main className="p-0 pt-16">  {/* Main content area with top padding to accommodate Navbar */}
          <Routes>  {/* Declares all the available routes within the app */}
            <Route path="/signup" element={<Signup />} />  {/* Path for signup page to register new users */}
            <Route path="/login" element={<Login />} />  {/* Path for login page to authenticate users */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>  {/* Ensures that CreatePost page is accessible only if authenticated */}
                  <CreatePost />  {/* Page to create a new post */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts"
              element={
                <ProtectedRoute>  {/* Ensures that PostsList is accessible only to authenticated users */}
                  <PostsList />  {/* Page that shows a list of posts */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>  {/* Ensures HomePage is accessible only after login */}
                  <HomePage />  {/* Default landing page after authentication */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>  {/* Ensures chat functionality is secured for logged-in users */}
                  <Chatai />  {/* Page to interact with chat AI */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:slug"
              element={
                <ProtectedRoute>  {/* Secures individual post view page for authenticated users */}
                  <PostView />  {/* Detail view for a specific post identified by slug */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>  {/* Protects profile page, requiring user login */}
                  <Profile />  {/* User's profile page to view and edit personal information */}
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}