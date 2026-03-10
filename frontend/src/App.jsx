import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy load the Signup component to improve performance by loading it only when needed
const Signup = React.lazy(() => import("./components/auth/Signup"));
// Lazy load the Login component
const Login = React.lazy(() => import("./components/auth/Login"));

import { AuthProvider } from "./components/AuthContext"; // Import the AuthProvider for managing authentication state
import { ProtectedRoute } from "./components/ProtectedRoute"; // Import ProtectedRoute to guard routes that require authentication

// Lazy load the CreatePost component
const CreatePost = React.lazy(() => import("./pages/CreatePost"));
// Lazy load the PostsList component
const PostsList = React.lazy(() => import("./components/posts/PostList"));
// Lazy load the Navbar component
const Navbar = React.lazy(() => import("./components/ui/Navbar"));
// Lazy load the PostView component
const PostView = React.lazy(() => import("./components/posts/PostView"));
// Lazy load the Profile component
const Profile = React.lazy(() => import("./pages/Profile"));
// Lazy load the Chatai component
const Chatai = React.lazy(() => import("./components/chatai/Chatai"));
// Lazy load the HomePage component
const HomePage = React.lazy(() => import("./pages/Home"));

export default function App() {
  return (
    <AuthProvider> {/* Wrap the application with AuthProvider to provide authentication context */}
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

      <BrowserRouter> {/* Use BrowserRouter to enable routing in the application */}
        <Suspense fallback={<div>Loading...</div>}> {/* Use Suspense to handle loading state for lazy-loaded components */}
          <Navbar /> {/* Render the Navbar component */}
          <main className="p-0 pt-16"> {/* Main content area with padding */}
            <Routes> {/* Define application routes */}
              <Route path="/signup" element={<Signup />} /> {/* Route for Signup page */}
              <Route path="/login" element={<Login />} /> {/* Route for Login page */}
              <Route
                path="/create"
                element={
                  <ProtectedRoute> {/* Protect the CreatePost route, requiring authentication */}
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts"
                element={
                  <ProtectedRoute> {/* Protect the PostsList route */}
                    <PostsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute> {/* Protect the HomePage route */}
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute> {/* Protect the Chatai route */}
                    <Chatai />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/:slug"
                element={
                  <ProtectedRoute> {/* Protect the PostView route, allowing dynamic slug parameter */}
                    <PostView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute> {/* Protect the Profile route */}
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