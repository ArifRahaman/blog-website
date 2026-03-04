# Blog Website

This project is a comprehensive blog website that allows users to create, read, update, and delete blog posts. It also includes user authentication, chat features, and notifications.

## Features

- **User Authentication**: Sign up and log in with email and password.
- **Posts Management**: Create, update, delete, and fetch posts.
- **Comments System**: Comment on posts and manage comments.
- **User Profiles**: Follow other users and update profiles.
- **Chat System**: Real-time chat feature between users.
- **Notifications**: Get notified about likes, comments, and follows.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Vite.js, Tailwind CSS
- **Authentication**: JWT
- **Other Libraries**: Axios, React Router, React Toastify, Framer Motion
- **File Uploads**: Cloudinary, Multer

## Installation Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ArifRahaman/blog-website.git
   cd blog-website
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

## Usage Guide

### Running the Backend

1. **Set up environment variables** in a `.env` file in the `backend` directory:
   ```plaintext
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_URL=your_cloudinary_url
   ```

2. **Start the backend server**:
   ```bash
   npm start
   ```

### Running the Frontend

1. **Start the frontend server**:
   ```bash
   npm run dev
   ```

2. **Access the application** at `http://localhost:3000`.

## Environment Variables

- `MONGO_URI`: MongoDB connection URI.
- `JWT_SECRET`: Secret key for JWT authentication.
- `CLOUDINARY_URL`: URL for Cloudinary API.
- `GEMINI_KEY`, `DEEPGRAM_KEY`, `DID_API_KEY`, `GROQ_KEY`: (Optional) Keys for additional integrations.

## API Reference

### Authentication

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Login an existing user.
- `GET /api/auth/me`: Get current user profile.
- `PUT /api/auth/me/update`: Update user profile.

### Posts

- `POST /api/posts`: Create a new post.
- `GET /api/posts`: Get all posts.
- `GET /api/posts/:slug`: Get a post by slug.
- `PUT /api/posts/:id`: Update a post.
- `DELETE /api/posts/:id`: Delete a post.

### Comments

- `POST /api/comments`: Add a comment to a post.
- `GET /api/comments/:postId`: Get comments for a post.

### Notifications

- `GET /api/notifications`: Get notifications.
- `POST /api/notifications/mark-read`: Mark notifications as read.

### Chats

- `GET /api/chats`: Get all chat messages for a user.
- `GET /api/chats/:userId`: Get chat messages for a specific user.
- `POST /api/chats`: Send a chat message.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

---
> 🤖 *Last automated update: 2026-03-05 01:24:30*