import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy load the Signup component for better performance
const Signup = React.lazy(() => import("./components/auth/Signup"));

// Lazy load the Login component for better performance
const Login = React.lazy(() => import("./components/auth/Login"));

import { AuthProvider } from "./components/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Lazy load the CreatePost component for better performance
const CreatePost = React.lazy(() => import("./pages/CreatePost"));

// Lazy load the PostsList component for better performance
const PostsList = React.lazy(() => import("./components/posts/PostList"));

// Lazy load the Navbar component for better performance
const Navbar = React.lazy(() => import("./components/ui/Navbar"));

// Lazy load the PostView component for better performance
const PostView = React.lazy(() => import("./components/posts/PostView"));

// Lazy load the Profile component for better performance
const Profile = React.lazy(() => import("./pages/Profile"));

// Lazy load the Chatai component for better performance
const Chatai = React.lazy(() => import("./components/chatai/Chatai"));

// Lazy load the HomePage component for better performance
const HomePage = React.lazy(() => import("./pages/Home"));

export default function App() {
  return (
    // Provide authentication context to the entire application
    <AuthProvider>
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
        {/* Suspense component to show a fallback UI while lazy-loaded components are being fetched */}
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}