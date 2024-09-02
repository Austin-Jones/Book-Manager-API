# Book Management API

## Overview

The Book Management API is a RESTful API for managing a collection of books. It provides endpoints for creating, retrieving, updating, and deleting books. The API uses JSON Web Tokens (JWT) for authentication, ensuring secure access to endpoints.

## Features

- User registration and login with JWT authentication
- CRUD operations for managing books
- Secure endpoints requiring JWT for access

## Endpoints

### Authentication

- **Register**: `POST /register`
  - Register a new user.
  - **Request Body**:
    ```json
    {
      "username": "johndoe",
      "password": "password123"
    }
    ```

- **Login**: `POST /login`
  - Log in to receive a JWT token.
  - **Request Body**:
    ```json
    {
      "username": "johndoe",
      "password": "password123"
    }
    ```
  - **Response**:
    ```json
    {
      "token": "your-jwt-token"
    }
    ```

### Book Management

- **Get All Books**: `GET /books`
  - Retrieve a list of all books. Requires JWT authentication.

- **Create Book**: `POST /books`
  - Create a new book.
  - **Request Body**:
    ```json
    {
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "published_date": "1925-04-10",
      "isbn": "9780743273565",
      "pages": 180,
      "cover_url": "http://example.com/cover.jpg",
      "language": "English"
    }
    ```

- **Get Book by ID**: `GET /books/{id}`
  - Retrieve a single book by ID. Requires JWT authentication.

- **Update Book**: `PUT /books/{id}`
  - Update an existing book.
  - **Request Body**:
    ```json
    {
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "published_date": "1925-04-10",
      "isbn": "9780743273565",
      "pages": 180,
      "cover_url": "http://example.com/cover.jpg",
      "language": "English"
    }
    ```

- **Delete Book**: `DELETE /books/{id}`
  - Delete a book by ID. Requires JWT authentication.

## Setup

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- SQLite (or any other database of your choice)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/book-management-api.git
   cd book-management-api

2. Install Dependencies
```bash
    npm install
```

3. Run the application
```bash
    npm start
```
## Usage

### Register a New User

Use an HTTP client like Postman or `curl` to send a POST request to `/register` with a JSON body containing the `username` and `password`.

**Example `curl` Command:**

```bash
curl -X POST http://localhost:3000/register \
     -H "Content-Type: application/json" \
     -d '{"username": "johndoe", "password": "password123"}'
