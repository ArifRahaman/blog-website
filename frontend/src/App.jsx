import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy load components for better performance
const Signup = React.lazy(() => import("./components/auth/Signup"));
const Login = React.lazy(() => import("./components/auth/Login"));
const AuthProvider = React.lazy(() => import("./components/AuthContext"));
const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute"));
const CreatePost = React.lazy(() => import("./pages/CreatePost"));
const PostsList = React.lazy(() => import("./components/posts/PostList"));
const Navbar = React.lazy(() => import("./components/ui/Navbar"));
const PostView = React.lazy(() => import("./components/posts/PostView"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Chatai = React.lazy(() => import("./components/chatai/Chatai"));
const HomePage = React.lazy(() => import("./pages/Home"));

export default function App() {
  return (
    <AuthProvider>  {/* Wrap the application with AuthProvider for authentication context */}
      <ToastContainer
        position="top-right"  {/* Position the toast notifications at the top-right corner */}
        autoClose={3000}  {/* Automatically close the toast after 3000ms */}
        hideProgressBar={false}  {/* Show the progress bar in the toast */}
        newestOnTop={true}  {/* Display the newest toast on top */}
        closeOnClick  {/* Allow closing the toast by clicking on it */}
        pauseOnHover  {/* Pause the auto-close timer when hovering over the toast */}
        draggable  {/* Allow dragging the toast */}
        theme="colored"  {/* Use colored theme for the toast notifications */}
      />

      <BrowserRouter>  {/* Use BrowserRouter for handling routing in the application */}
        <Suspense fallback={<div>Loading...</div>}>  {/* Display a loading message while components are being loaded */}
          <Navbar />  {/* Render the Navbar component */}
          <main className="p-0 pt-16">  {/* Main content area with padding */}
            <Routes>  {/* Define the routes for the application */}
              <Route path="/signup" element={<Signup />} />  {/* Route for signup page */}
              <Route path="/login" element={<Login />} />  {/* Route for login page */}
              <Route
                path="/create"
                element={
                  <ProtectedRoute>  {/* Protect the CreatePost route */}
                    <CreatePost />  {/* Render CreatePost component */}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts"
                element={
                  <ProtectedRoute>  {/* Protect the PostsList route */}
                    <PostsList />  {/* Render PostsList component */}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>  {/* Protect the HomePage route */}
                    <HomePage />  {/* Render HomePage component */}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>  {/* Protect the Chatai route */}
                    <Chatai />  {/* Render Chatai component */}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/:slug"
                element={
                  <ProtectedRoute>  {/* Protect the PostView route */}
                    <PostView />  {/* Render PostView component */}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>  {/* Protect the Profile route */}
                    <Profile />  {/* Render Profile component */}
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