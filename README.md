# Blog Website

A feature-rich blog platform that allows users to create, manage, and interact with posts, comments, and notifications. The platform also supports user authentication and chat functionalities.

## Features

- **User Authentication**: Secure sign-up, login, and profile management for users.
- **Post Management**: Users can create, update, delete, and like posts.
- **Commenting System**: Comment on posts with a structured comment model.
- **Notifications**: Receive notifications for likes, comments, and follows.
- **Chat Functionality**: Chat sessions and messages between users.
- **Profile Management**: Follow other users and manage personal profiles.
- **Image Upload**: Upload avatars and cover images for posts.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React, Vite, TailwindCSS
- **Authentication**: JSON Web Tokens (JWT)
- **Cloud Storage**: Cloudinary
- **State Management**: React Context API

## Installation Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/ArifRahaman/blog-website.git
   ```

2. Navigate to the backend folder and install dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Navigate to the frontend folder and install dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

## Usage Guide

1. **Backend**:
   - Start the backend server:

     ```bash
     cd backend
     npm start
     ```

2. **Frontend**:
   - Start the frontend development server:

     ```bash
     cd frontend
     npm run dev
     ```

3. Access the application via `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the `backend` directory and set the following variables:

```
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_URL=<your_cloudinary_url>
GROQ_KEY=<your_groq_key>
```

## API Reference

### Authentication

- **POST /api/auth/signup**: Register a new user.
- **POST /api/auth/login**: Authenticate an existing user.

### Posts

- **GET /api/posts**: Fetch all posts.
- **GET /api/posts/:slug**: Fetch a specific post by slug.
- **POST /api/posts**: Create a new post.
- **PUT /api/posts/:id**: Update a post.
- **DELETE /api/posts/:id**: Delete a post.

### Comments

- **POST /api/comments**: Add a comment to a post.
- **GET /api/comments/:postId**: Fetch comments for a specific post.

### Notifications

- **GET /api/notifications**: Fetch user notifications.
- **POST /api/notifications/mark-read**: Mark notifications as read.

### Chats

- **GET /api/chats**: Fetch all chat messages for the authenticated user.
- **GET /api/chats/:userId**: Fetch chat messages for a specific user (admin or owner).
- **POST /api/chats**: Send a chat message.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
> 🤖 *Last automated update: 2026-03-06 16:33:40*