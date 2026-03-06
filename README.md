# Blog Website

## Description

A comprehensive platform for blogging, allowing users to create, edit, and delete posts, as well as interact with others through comments and notifications. This application is designed to provide a seamless blogging experience with integrated user authentication and content management capabilities.

## Features

- User authentication and authorization
- Create, read, update, and delete blog posts
- Commenting system on blog posts
- Like and follow functionalities
- User profiles with avatars and bios
- Notifications for likes, comments, and follows
- Real-time chat feature
- Upload and manage profile pictures and post covers

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React.js, Vite, TailwindCSS
- **Authentication:** JSON Web Tokens (JWT)
- **Cloud Storage:** Cloudinary
- **Real-time Features:** WebSockets
- **Miscellaneous:** Axios, React Router, React Toastify

## Installation Instructions

1. **Clone the repository:**

    ```bash
    git clone https://github.com/ArifRahaman/blog-website.git
    cd blog-website
    ```

2. **Backend Setup:**

    ```bash
    cd backend
    npm install
    ```

3. **Frontend Setup:**

    ```bash
    cd frontend
    npm install
    ```

4. **Environment Variables:**

    Create a `.env` file in the `backend` directory:

    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_URL=your_cloudinary_url
    ```

5. **Run the Application:**

    - **Backend:**

      ```bash
      cd backend
      npm start
      ```

    - **Frontend:**

      ```bash
      cd frontend
      npm run dev
      ```

## Usage Guide

1. **User Registration and Authentication:**
   - Sign up and log in to access all features.
   - Update profile with avatar and bio.

2. **Creating and Managing Posts:**
   - Create posts using a rich text editor.
   - Edit or delete your posts as needed.

3. **Interacting with Content:**
   - Comment and like posts.
   - Follow other users to receive updates on their activities.

4. **Real-time Chat:**
   - Use the chat feature to communicate with other users in real-time.

5. **Notifications:**
   - Receive notifications for likes, comments, and follows.

## Environment Variables

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT authentication.
- `CLOUDINARY_URL`: Cloudinary URL for image uploads.
- `GEMINI_KEY`: (Optional) Key for external API integration.
- `DEEPGRAM_KEY`: (Optional) Key for voice recognition services.
- `DID_API_KEY`: (Optional) Key for additional API functionalities.
- `GROQ_KEY`: (Optional) Key for specific API interactions.

## API Reference

- **Authentication Endpoints:**
  - `POST /api/auth/signup`: User registration.
  - `POST /api/auth/login`: User login.
  - `GET /api/auth/me`: Get current user profile.
  
- **Post Endpoints:**
  - `POST /api/posts`: Create a new post.
  - `GET /api/posts`: Get all posts.
  - `GET /api/posts/:slug`: Get a specific post by slug.
  - `PUT /api/posts/:id`: Update a post.
  - `DELETE /api/posts/:id`: Delete a post.

- **Comment Endpoints:**
  - `POST /api/comments`: Add a comment to a post.
  - `GET /api/comments/:postId`: Get comments for a post.

- **Notification Endpoints:**
  - `GET /api/notifications`: Get all notifications.
  - `POST /api/notifications/mark-read`: Mark notifications as read.

- **User Endpoints:**
  - `GET /api/users/:id`: Get user profile.
  - `POST /api/users/:id/follow`: Follow a user.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.