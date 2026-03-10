import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import { AuthProvider } from "./components/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import CreatePost from "./pages/CreatePost"; // <-- import
import PostsList from "./components/posts/PostList"; // ✅ Use the real posts list
import Navbar from "./components/ui/Navbar"; // ✅ Use the real navbar
import PostView from "./components/posts/PostView"; // ✅ Use the real post view
import Profile from "./pages/Profile";
import Chatai from "./components/chatai/Chatai"; // ✅ Use the real Chatai component
import HomePage from "./pages/Home";

export default function App() {
  return (
    // AuthProvider is a context provider that wraps the entire application.
    // It provides authentication state and methods to all components within the app.
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
        <Navbar /> {/* ✅ Real Navbar */}
        <main className="p-0 pt-16">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            {/* ProtectedRoute is a component that checks if a user is authenticated.
                If not, it redirects them to the login page. Otherwise, it renders the child component. */}
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
            {/* <Route>
              <Route path="/posts/:slug" element={<PostView />} />
            </Route> */}
          </Routes>

        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}