# Blog Website

A sophisticated blog website platform engineered for advanced engineers seeking a scalable and robust solution for managing posts, comments, and user interactions with integrated chat functionalities.

## Features

- **User Authentication**: Secure user signup and login with JWT-based authentication.
- **Post Management**: Creation, retrieval, update, and deletion of posts with slug-based routing.
- **Commenting System**: Add, view, and manage comments on posts.
- **Notifications**: Real-time notifications for likes, comments, and follows.
- **Chat Functionality**: User-specific chat sessions with message threads.
- **File Uploads**: Support for avatar and cover image uploads using Cloudinary.
- **Real-time Interaction**: Chat message retrieval and posting with user permissions.
- **Profile Management**: User-specific profiles with avatar, bio, and follow functionalities.

## Tech Stack

- **Backend**: Node.js, Express, Mongoose, JWT, Cloudinary
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Cloudinary

## Installation Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ArifRahaman/blog-website.git
   cd blog-website
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

## Usage Guide

1. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend server**:
   ```bash
   cd ../frontend
   npm run dev
   ```

3. Navigate to `http://localhost:3000` to access the application.

## Environment Variables

Create a `.env` file in the `backend` directory with the following keys:

- `JWT_SECRET`: Secret key for JWT tokens.
- `MONGO_URI`: MongoDB connection string.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.

## API Reference

### Auth

- `POST /api/auth/signup`: User registration endpoint.
- `POST /api/auth/login`: User login endpoint.
- `PUT /api/auth/me/update`: Update user profile.

### Posts

- `POST /api/posts`: Create a new post.
- `GET /api/posts`: Retrieve all posts.
- `GET /api/posts/:slug`: Retrieve a post by slug.
- `PUT /api/posts/:id`: Update a post.
- `DELETE /api/posts/:id`: Delete a post.

### Comments

- `POST /api/comments`: Create a comment.
- `GET /api/comments/:postId`: Retrieve comments for a post.

### Notifications

- `GET /api/notifications`: Retrieve notifications.
- `POST /api/notifications/mark-read`: Mark notifications as read.

### Chats

- `GET /api/chats`: Retrieve all chat messages for authenticated user.
- `GET /api/chats/:userId`: Retrieve chat messages for a specific user (admin access).
- `POST /api/chats`: Post a chat message.

## Contributing

1. Fork the project.
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
> 🤖 *Last automated update: 2026-03-06 16:09:59*