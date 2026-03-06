# Blog Website

A comprehensive blog platform providing user authentication, post creation, comment handling, and notifications. This advanced project is built using Node.js and React, offering robust scalability and extensive functionality for blogging applications.

## Features

- **User Authentication**: Secure login and signup using JSON Web Token (JWT).
- **Post Management**: Create, update, delete, and retrieve blog posts using RESTful endpoints.
- **Comment System**: Add and manage comments on blog posts.
- **Notifications**: Real-time notifications for likes, comments, and follows.
- **Chat Functionality**: Manage chat sessions and messages.
- **File Uploads**: Avatar and cover image uploads with Cloudinary integration.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JSON Web Token, Cloudinary
- **Frontend**: React, React Router, React Toastify, Tailwind CSS
- **Utilities**: Axios, Draft.js, Framer Motion, Slugify

## Installation Instructions

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Usage Guide

### Backend

1. Start the server:
   ```bash
   npm run dev
   ```
2. Access API endpoints at `http://localhost:5000/api`.

### Frontend

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open the application in your browser at `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the `backend` directory with the following keys:

- `JWT_SECRET`: Secret key for JWT token encryption.
- `MONGO_URI`: MongoDB connection string.
- `CLOUDINARY_API_KEY`: Cloudinary API key for image uploads.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
- `GROQ_KEY`: API key for Groq operations.

## API Reference

### Authentication Routes

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Authenticate a user and return a JWT token.

### Post Routes

- `POST /api/posts`: Create a new blog post.
- `GET /api/posts`: Retrieve all blog posts.
- `GET /api/posts/:slug`: Retrieve a blog post by slug.
- `PUT /api/posts/:id`: Update a blog post.
- `DELETE /api/posts/:id`: Delete a blog post.

### Comment Routes

- `POST /api/comments`: Add a comment to a post.
- `GET /api/comments/:postId`: Retrieve comments for a specific post.

### Notification Routes

- `GET /api/notifications`: Retrieve user notifications.
- `POST /api/notifications/mark-read`: Mark notifications as read.

### Chat Routes

- `GET /api/chats`: Retrieve chat messages for the authenticated user.
- `GET /api/chats/:userId`: Retrieve messages for a specific user (admin access).
- `POST /api/chats`: Send a new chat message.

### Upload Routes

- `POST /api/uploads/avatar`: Upload user avatar.
- `POST /api/uploads/cover`: Upload post cover image.

## Contributing

Contributions are welcome. Please submit a pull request with detailed changes and testing steps.

## License

This project is licensed under the MIT License.