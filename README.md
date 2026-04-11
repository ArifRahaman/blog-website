# Blog Website

## Features

- User authentication (signup, login)
- Create, read, update, and delete posts
- Comment on posts
- Like posts
- Follow other users
- Real-time notifications for likes, comments, and follows
- Chat functionality with ChatAI
- Responsive design

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Uploads**: Cloudinary
- **Styling**: Tailwind CSS
- **State Management**: React Context API

## Installation

### Prerequisites

- Node.js and npm installed
- MongoDB instance running
- Cloudinary account for image uploads

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/ArifRahaman/blog-website.git
   ```

2. Navigate to the backend directory and install dependencies:
   ```bash
   cd blog-website/backend
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following variables:
   ```plaintext
   MONGODB_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT Secret>
   CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
   CLOUDINARY_API_KEY=<Your Cloudinary API Key>
   CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

5. Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

6. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage Guide

- Access the application at `http://localhost:3000`.
- Sign up or log in to start using the blog features.
- Create, edit, or delete posts.
- Comment on and like posts.
- Follow other users to receive notifications.

## Environment Variables

Ensure the following environment variables are set in the `.env` file for the backend:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## API Reference

### Authentication

- **POST /signup**: Register a new user
- **POST /login**: Authenticate a user

### Posts

- **POST /api/posts**: Create a new post
- **GET /api/posts**: Retrieve all posts
- **GET /api/posts/:slug**: Retrieve a post by slug
- **PUT /api/posts/:id**: Update a post
- **DELETE /api/posts/:id**: Delete a post

### Comments

- **POST /api/comments**: Add a comment to a post
- **GET /api/comments/:postId**: Retrieve comments for a post

### Notifications

- **GET /api/notifications**: Retrieve notifications
- **POST /api/notifications/mark-read**: Mark notifications as read

### Users

- **GET /api/users/:id**: Retrieve user profile
- **POST /api/users/:id/follow**: Follow a user

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.