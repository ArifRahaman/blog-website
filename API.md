# API Reference Documentation

## Overview

This API provides endpoints for managing a blog website, including user authentication, post management, comments, notifications, and chat functionalities. Below is a detailed reference for each endpoint, including request/response schemas, authentication requirements, error codes, and example `curl` commands.

## Authentication

- **Method**: Bearer Token
- **Header**: `Authorization: Bearer <token>`

## Endpoints

### Authentication

#### POST `/api/auth/signup`

- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **201 Created**: User successfully registered.
  - **400 Bad Request**: Validation errors.
- **Curl Example**:
  ```bash
  curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "email": "john@example.com", "password": "securePassword"}'
  ```

#### POST `/api/auth/login`

- **Description**: Log in a user.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **200 OK**: Returns JWT token.
  - **401 Unauthorized**: Invalid credentials.
- **Curl Example**:
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "securePassword"}'
  ```

### Posts

#### GET `/api/posts`

- **Description**: Retrieve all posts.
- **Response**:
  - **200 OK**: List of posts.
- **Curl Example**:
  ```bash
  curl -X GET http://localhost:5000/api/posts
  ```

#### POST `/api/posts`

- **Description**: Create a new post.
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "summary": "string",
    "tags": ["string"]
  }
  ```
- **Response**:
  - **201 Created**: Post successfully created.
  - **400 Bad Request**: Validation errors.
- **Curl Example**:
  ```bash
  curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Post", "content": "Post content", "summary": "Post summary", "tags": ["tag1", "tag2"]}'
  ```

#### GET `/api/posts/:slug`

- **Description**: Retrieve a post by its slug.
- **Response**:
  - **200 OK**: Post details.
  - **404 Not Found**: Post not found.
- **Curl Example**:
  ```bash
  curl -X GET http://localhost:5000/api/posts/some-post-slug
  ```

#### PUT `/api/posts/:id`

- **Description**: Update a post.
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "summary": "string",
    "tags": ["string"]
  }
  ```
- **Response**:
  - **200 OK**: Post successfully updated.
  - **404 Not Found**: Post not found.
- **Curl Example**:
  ```bash
  curl -X PUT http://localhost:5000/api/posts/12345 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Post", "content": "Updated content", "summary": "Updated summary", "tags": ["tag1", "tag2"]}'
  ```

#### DELETE `/api/posts/:id`

- **Description**: Delete a post.
- **Authentication**: Required
- **Response**:
  - **200 OK**: Post successfully deleted.
  - **404 Not Found**: Post not found.
- **Curl Example**:
  ```bash
  curl -X DELETE http://localhost:5000/api/posts/12345 \
  -H "Authorization: Bearer <token>"
  ```

### Comments

#### POST `/api/comments`

- **Description**: Add a comment to a post.
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "postId": "string",
    "text": "string"
  }
  ```
- **Response**:
  - **201 Created**: Comment successfully added.
  - **400 Bad Request**: Validation errors.
- **Curl Example**:
  ```bash
  curl -X POST http://localhost:5000/api/comments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"postId": "12345", "text": "Great post!"}'
  ```

#### GET `/api/comments/:postId`

- **Description**: Retrieve comments for a post.
- **Response**:
  - **200 OK**: List of comments.
- **Curl Example**:
  ```bash
  curl -X GET http://localhost:5000/api/comments/12345
  ```

### Notifications

#### GET `/api/notifications`

- **Description**: Retrieve notifications for the authenticated user.
- **Authentication**: Required
- **Response**:
  - **200 OK**: List of notifications.
- **Curl Example**:
  ```bash
  curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer <token>"
  ```

#### POST `/api/notifications/mark-read`

- **Description**: Mark notifications as read.
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "notificationIds": ["string"]
  }
  ```
- **Response**:
  - **200 OK**: Notifications marked as read.
- **Curl Example**:
  ```bash
  curl -X POST http://localhost:5000/api/notifications/mark-read \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"notificationIds": ["123", "456"]}'
  ```

### Chat

#### GET `/api/chats`

- **Description**: Retrieve chat messages for the authenticated user.
- **Authentication**: Required
- **Response**:
  - **200 OK**: List of chat messages.
- **Curl Example**:
  ```bash
  curl -X GET http://localhost:5000/api/chats \
  -H "Authorization: Bearer <token>"
  ```

#### POST `/api/chats`

- **Description**: Send a chat message.
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "content": "string",
    "sessionId": "string"
  }
  ```
- **Response**:
  - **201 Created**: Messages (user and bot) successfully created.
- **Curl Example**:
  ```bash
  curl -X POST http://localhost:5000/api/chats \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, how are you?", "sessionId": "abc123"}'
  ```

## Error Codes

- **400 Bad Request**: Invalid input or missing required fields.
- **401 Unauthorized**: Missing or invalid authentication token.
- **403 Forbidden**: Access denied.
- **404 Not Found**: Resource not found.
- **500 Internal Server Error**: Server encountered an error.

This documentation provides a comprehensive overview of the API endpoints, including their usage, request/response formats, and examples for testing with `curl`. Ensure to replace `<token>` with a valid JWT token for authenticated requests.