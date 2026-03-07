# Blog Website

## Description
This project is a sophisticated blog platform designed for advanced engineers. It features a robust backend powered by Node.js and Express, and a dynamic frontend built with React and Vite. The platform supports user authentication, post creation and management, notifications, and a unique chat interface for user interaction. The application architecture is modular, allowing for seamless scalability and maintainability. Key aspects include JWT-based authentication, a MongoDB database for efficient data storage, and Cloudinary for managing media uploads. The chat system is integrated with a real-time message handling mechanism, making the platform interactive and user-friendly.

## Features
- User Authentication: Secure login and signup processes with JWT-based authentication.
- Post Management: Create, update, delete, and view posts with rich content support.
- Comments: Add and view comments on posts.
- Notifications: Real-time notifications for likes, comments, and follows.
- User Profiles: Manage user profiles including avatars and follow relationships.
- Chat System: Interactive chat sessions with real-time message handling.

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Multer, Cloudinary
- **Frontend**: React, Vite, TailwindCSS, Axios, React Router, React Toastify
- **Authentication**: JSON Web Tokens (JWT)
- **Database**: MongoDB
- **Cloud Storage**: Cloudinary

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ArifRahaman/blog-website.git
   cd blog-website
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Usage Guide
### Backend
1. Configure environment variables in the `backend/.env` file.
2. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

### Frontend
1. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## Environment Variables
- `JWT_SECRET`: Secret key for JWT authentication.
- `MONGO_URI`: MongoDB connection string.
- `CLOUDINARY_URL`: Cloudinary API URL for image uploads.
- `GROQ_KEY`, `DEEPGRAM_KEY`, `DID_API_KEY`: Keys for external API integrations.

## API Reference
### Authentication
- **POST** `/api/auth/signup`: Register a new user.
- **POST** `/api/auth/login`: Authenticate an existing user.
- **GET** `/api/auth/me`: Retrieve authenticated user details.
- **PUT** `/api/auth/me/update`: Update user profile.

### Posts
- **POST** `/api/posts`: Create a new post.
- **GET** `/api/posts`: Retrieve all posts.
- **GET** `/api/posts/:slug`: Retrieve a post by slug.
- **PUT** `/api/posts/:id`: Update a post.
- **DELETE** `/api/posts/:id`: Delete a post.
- **POST** `/api/posts/:id/like`: Like a post.
- **POST** `/api/posts/:id/comments`: Add a comment to a post.

### Comments
- **POST** `/api/comments`: Add a comment.
- **GET** `/api/comments/:postId`: Retrieve comments for a post.

### Notifications
- **GET** `/api/notifications`: Retrieve notifications.
- **POST** `/api/notifications/mark-read`: Mark notifications as read.
- **POST** `/api/notifications/clear`: Clear notifications.

### Chat
- **GET** `/api/chats`: Retrieve chat messages for authenticated user.
- **GET** `/api/chats/:userId`: Retrieve chat messages for a specific user (admin or owner).
- **POST** `/api/chats`: Send a chat message.

## Contributing
Contributions are welcome. Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Ensure that your code follows the project's coding style.
5. Commit your changes with a clear message.
6. Push your changes to your fork.
7. Submit a pull request to the main repository.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
> 🤖 *Last automated update: 2026-03-07 23:20:44*