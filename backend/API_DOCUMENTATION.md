# Images Gallery API Documentation

## Overview
This API provides user authentication using JWT tokens and image management functionality with user-specific galleries.

## Base URL
```
http://localhost:5000
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Management Endpoints

#### Get Current User Profile (with images)
```
GET /api/users/me
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "images": [
      {
        "id": 1,
        "filename": "image1.jpg",
        "s3_key": "gallery/image1.jpg",
        "url": "https://s3.amazonaws.com/...",
        "signed_url": "https://s3.amazonaws.com/...?signed",
        "content_type": "image/jpeg",
        "size": 123456,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### Get Current User's Images Only
```
GET /api/users/me/images
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "images": [...],
  "count": 5
}
```

#### Update User Profile
```
PUT /api/users/me
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com"
}
```

#### Get User by ID (Public)
```
GET /api/users/:id
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Deactivate Account
```
DELETE /api/users/me
```
**Headers:** `Authorization: Bearer <token>`

### Image Management Endpoints

#### Upload Image
```
POST /api/images/upload
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "folder": "gallery"
}
```

**Response:**
```json
{
  "success": true,
  "image": {
    "id": 1,
    "filename": "gallery/unique-filename.jpg",
    "s3_key": "gallery/unique-filename.jpg",
    "url": "https://s3.amazonaws.com/...",
    "content_type": "image/jpeg",
    "size": 123456,
    "user_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get My Images
```
GET /api/images/my-images
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "images": [...],
  "count": 3
}
```

#### Get All Images (Public Gallery)
```
GET /api/images
```

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": 1,
      "filename": "image1.jpg",
      "s3_key": "gallery/image1.jpg",
      "url": "https://s3.amazonaws.com/...",
      "signed_url": "https://s3.amazonaws.com/...?signed",
      "content_type": "image/jpeg",
      "size": 123456,
      "created_at": "2024-01-01T00:00:00.000Z",
      "user": {
        "first_name": "John",
        "last_name": "Doe"
      }
    }
  ]
}
```

#### Get Single Image
```
GET /api/images/:id
```

**Response:**
```json
{
  "success": true,
  "image": {
    "id": 1,
    "filename": "image1.jpg",
    "signed_url": "https://s3.amazonaws.com/...?signed",
    "user": {
      "first_name": "John",
      "last_name": "Doe"
    },
    ...
  }
}
```

#### Delete Image
```
DELETE /api/images/:id
```
**Headers:** `Authorization: Bearer <token>`

**Note:** Users can only delete their own images.

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

## Error Responses

### Authentication Errors
```json
{
  "error": "Access token required"
}
```

```json
{
  "error": "Invalid or expired token"
}
```

### Validation Errors
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### General Errors
```json
{
  "error": "Error message describing what went wrong"
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Images Table
```sql
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  s3_key VARCHAR(500) NOT NULL,
  url VARCHAR(500) NOT NULL,
  content_type VARCHAR(100),
  size INTEGER,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
POSTGRES_DATABASE=gallery_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
JWT_SECRET=your-super-secret-jwt-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=your-bucket-name
AWS_BUCKET_REGION=us-east-1
```

3. Run database migrations:
```bash
npm run migrate
```

4. Start the server:
```bash
npm run dev
```

## Security Features

- Password hashing using bcrypt
- JWT token authentication
- Input validation and sanitization
- SQL injection protection with parameterized queries
- User ownership verification for image operations
- CORS and security headers with Helmet 