# Blog Website

A full-stack blog website that allows users to create, view, and manage posts. This platform also supports user authentication, commenting, and notifications for interactions like likes and follows.

## Features

- User Authentication: Sign up, login, and update profile.
- Post Management: Create, view, update, and delete posts.
- Commenting System: Add and view comments on posts.
- Notifications: Receive notifications for likes, comments, and follows.
- Chat Functionality: Engage in chat sessions with stored messages.
- Profile Management: Follow users and manage followers.
- Upload System: Upload avatars and post covers.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer & Cloudinary
- **Styling**: Tailwind CSS

## Installation Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ArifRahaman/blog-website.git
   ```
   
2. **Backend Setup**:
   ```bash
   cd blog-website/backend
   npm install
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables**: Create a `.env` file in the `backend` directory and include the following variables:
   ```env
   MONGO_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT Secret>
   CLOUDINARY_URL=<Your Cloudinary URL>
   ```

## Usage Guide

1. **Run the Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Run the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**: Open your browser and navigate to `http://localhost:3000`.

## Environment Variables

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT authentication.
- `CLOUDINARY_URL`: Cloudinary URL for image uploads.
- `GROQ_KEY`: Key for handling specific API requests.
- `DEEPGRAM_KEY`, `DID_API_KEY`: Additional keys for extended functionalities.

## API Reference

### Authentication

- `POST /api/auth/signup` - Register a new user.
- `POST /api/auth/login` - Authenticate an existing user.
- `PUT /api/auth/:id` - Update user information.
- `GET /api/auth/me` - Retrieve current user profile.

### Posts

- `POST /api/posts` - Create a new post.
- `GET /api/posts` - Retrieve all posts.
- `GET /api/posts/:slug` - Retrieve a post by slug.
- `PUT /api/posts/:id` - Update a post.
- `DELETE /api/posts/:id` - Delete a post.

### Comments

- `POST /api/comments` - Add a comment to a post.
- `GET /api/comments/:postId` - Get comments for a specific post.

### Notifications

- `GET /api/notifications` - Get all notifications.
- `POST /api/notifications/mark-read` - Mark notifications as read.

### Chat

- `GET /api/chats` - Retrieve chat messages for the current user.
- `GET /api/chats/:userId` - Retrieve chat messages for a specific user.
- `POST /api/chats` - Send a new chat message.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

## License

This project is licensed under the MIT License.

---
> 🤖 *Last automated update: 2026-03-06 16:29:52*