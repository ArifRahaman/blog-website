# Blog Website

The Blog Website is a sophisticated platform that integrates advanced chat features, user authentication, and content management capabilities. Designed for scalability and ease of use, it leverages modern technologies to deliver a seamless user experience.

## Features

- **User Authentication**: Secure login and signup with JWT-based authorization.
- **Content Management**: Create, update, delete, and view posts with rich text support.
- **Notifications**: Real-time notifications of likes, comments, and follows.
- **Chat Functionality**: Chat sessions with message storage and retrieval.
- **Profile Management**: User profiles with avatar upload and followers management.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React, Vite, TailwindCSS
- **Authentication**: JWT
- **Deployment**: Cloudinary, Streamifier

## Installation Instructions

### Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/ArifRahaman/blog-website.git
   cd blog-website/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory with the following variables:
   ```plaintext
   MONGO_URI=<your_mongo_uri>
   JWT_SECRET=<your_jwt_secret>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `frontend` directory with the following variables:
   ```plaintext
   VITE_API_URL=<your_backend_api_url>
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage Guide

- Navigate to `http://localhost:3000` to access the frontend.
- Use the signup and login forms to create and access user accounts.
- Create and manage posts through the provided UI.
- Interact with other users through comments and likes.
- Access chat features under your profile page.

## Environment Variables

### Backend

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT authentication.
- `CLOUDINARY_API_KEY`: API key for Cloudinary.
- `CLOUDINARY_API_SECRET`: API secret for Cloudinary.
- `CLOUDINARY_CLOUD_NAME`: Cloud name for Cloudinary.

### Frontend

- `VITE_API_URL`: URL of the backend API.

## API Reference

### Auth Routes

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Authenticate a user.
- `GET /api/auth/me`: Fetch authenticated user details.

### Post Routes

- `GET /api/posts`: Retrieve all posts.
- `GET /api/posts/:slug`: Retrieve a post by slug.
- `POST /api/posts`: Create a new post.
- `PUT /api/posts/:id`: Update a post.
- `DELETE /api/posts/:id`: Delete a post.

### Chat Routes

- `GET /api/chats`: Retrieve chat messages for the authenticated user.
- `GET /api/chats/:userId`: Retrieve chat messages for a specific user.
- `POST /api/chats`: Create a new chat message.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---
> 🤖 *Last automated update: 2026-03-06 22:00:32*