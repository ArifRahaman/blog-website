import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = React.lazy(() => import("./components/auth/Signup"));
const Login = React.lazy(() => import("./components/auth/Login"));

import { AuthProvider } from "./components/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const CreatePost = React.lazy(() => import("./pages/CreatePost"));
const PostsList = React.lazy(() => import("./components/posts/PostList"));
const Navbar = React.lazy(() => import("./components/ui/Navbar"));
const PostView = React.lazy(() => import("./components/posts/PostView"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Chatai = React.lazy(() => import("./components/chatai/Chatai"));
const HomePage = React.lazy(() => import("./pages/Home"));

export default function App() {
  return (
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
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          <main className="p-0 pt-16">
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts"
                element={
                  <ProtectedRoute>
                    <PostsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chatai />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/:slug"
                element={
                  <ProtectedRoute>
                    <PostView />
                  </ProtectedRoute>
                }
              />
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