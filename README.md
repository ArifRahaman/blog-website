# Blog Website

A comprehensive blogging platform providing a full-featured API for posts, comments, user authentication, and notifications. The system architecture leverages a combination of front-end and back-end technologies to deliver seamless user experiences and scalable interactions.

## Features

- User authentication and management
- Post creation, update, and deletion
- Commenting on posts
- Notifications for likes, comments, and follows
- Real-time chat sessions
- Image uploads for avatars and post covers
- Protected routes for authenticated actions

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend**: React, React Router, Tailwind CSS, Vite
- **Utilities**: Axios, Toastify, Framer Motion
- **Validation & Security**: bcryptjs, jsonwebtoken, cors
- **Media Handling**: Cloudinary, multer, streamifier

## Installation Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ArifRahaman/blog-website.git
   ```

2. **Navigate to the backend directory**:
   ```bash
   cd blog-website/backend
   ```

3. **Install backend dependencies**:
   ```bash
   npm install
   ```

4. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

5. **Install frontend dependencies**:
   ```bash
   npm install
   ```

## Usage Guide

1. **Start the backend server**:
   Navigate to the backend directory and run:
   ```bash
   npm start
   ```

2. **Start the frontend development server**:
   Navigate to the frontend directory and run:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   Open your browser and go to `http://localhost:3000` to interact with the frontend.

## Environment Variables

Define the following environment variables in a `.env` file in the `backend` directory:

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT
- `CLOUDINARY_URL`: Cloudinary API URL
- `GEMINI_KEY`: API key for Gemini (optional)
- `DEEPGRAM_KEY`: API key for Deepgram (optional)
- `DID_API_KEY`: API key for DID (optional)
- `GROQ_KEY`: API key for GROQ (optional)

## API Reference

### Authentication
- **POST** `/api/auth/signup`: Register a new user
- **POST** `/api/auth/login`: Authenticate a user
- **GET** `/api/auth/me`: Get current user details
- **PUT** `/api/auth/me/update`: Update user profile

### Posts
- **GET** `/api/posts`: Retrieve all posts
- **POST** `/api/posts`: Create a new post
- **GET** `/api/posts/:slug`: Retrieve a post by slug
- **PUT** `/api/posts/:id`: Update a post
- **DELETE** `/api/posts/:id`: Delete a post
- **POST** `/api/posts/:id/like`: Like a post
- **POST** `/api/posts/:id/comments`: Add a comment to a post

### Comments
- **POST** `/api/comments`: Add a new comment
- **GET** `/api/comments/:postId`: Retrieve comments for a specific post

### Notifications
- **GET** `/api/notifications`: Retrieve notifications
- **POST** `/api/notifications/mark-read`: Mark notifications as read
- **POST** `/api/notifications/clear`: Clear notifications

### Users
- **GET** `/api/users/:id`: Retrieve user profile
- **POST** `/api/users/:id/follow`: Follow a user

### Uploads
- **POST** `/api/uploads/avatar`: Upload user avatar
- **POST** `/api/uploads/cover`: Upload post cover

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Architecture

```mermaid
flowchart TD
    backend_controllers_commentController_js["controllers/commentController.js"]
    backend_controllers_postControllers_js["controllers/postControllers.js"]
    backend_middleware_auth_js["middleware/auth.js"]
    backend_models_ChatSession_js["models/ChatSession.js"]
    backend_models_Notification_js["models/Notification.js"]
    backend_models_Post_js["models/Post.js"]
    backend_models_User_js["models/User.js"]
    backend_routes_auth_js["routes/auth.js"]
    backend_routes_commentRoutes_js["routes/commentRoutes.js"]
    backend_routes_postRoutes_js["routes/postRoutes.js"]
    backend_routes_posts_js["routes/posts.js"]
    backend_routes_uploadRoutes_js["routes/uploadRoutes.js"]
    backend_routes_users_js["routes/users.js"]
    frontend_src_App_jsx["src/App.jsx"]
    frontend_src_components_AuthContext_jsx["components/AuthContext.jsx"]

    backend_controllers_postControllers_js --> backend_models_Post_js
    backend_controllers_commentController_js --> backend_models_Post_js
    backend_routes_auth_js --> backend_models_User_js
    backend_routes_auth_js --> backend_middleware_auth_js
    backend_routes_commentRoutes_js --> backend_controllers_commentController_js
    backend_routes_commentRoutes_js --> backend_middleware_auth_js
    backend_models_User_js --> backend_models_ChatSession_js
    backend_middleware_auth_js --> backend_models_User_js
    backend_routes_postRoutes_js --> backend_models_Notification_js
    backend_routes_postRoutes_js --> backend_controllers_postControllers_js
    backend_routes_postRoutes_js --> backend_middleware_auth_js
    backend_routes_postRoutes_js --> backend_models_Post_js
    backend_routes_posts_js --> backend_models_User_js
    backend_routes_posts_js --> backend_models_Notification_js
    backend_routes_posts_js --> backend_middleware_auth_js
    backend_routes_posts_js --> backend_models_Post_js
    backend_routes_users_js --> backend_models_User_js
    backend_routes_users_js --> backend_middleware_auth_js
    frontend_src_App_jsx --> frontend_src_components_AuthContext_jsx


---
> 🤖 *Last automated update: 2026-03-06 21:51:19*