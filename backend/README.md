# Images Gallery Backend

A Node.js backend server with AWS S3 integration for image uploading and management.

## Features

- Upload images to AWS S3 with base64 encoding support
- PostgreSQL database for metadata storage  
- RESTful API endpoints for image management
- Pre-signed URLs for secure image access
- Image deletion from both S3 and database

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database and create a `.env` file with the following variables:
```
PORT=5000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=gallery_db
AWS_BUCKET_NAME=your-bucket-name
AWS_BUCKET_REGION=us-east-1
AWS_BUCKET_KEY=storage
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

3. Run database migrations:
```bash
npm run migrate
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Upload Image
- **POST** `/api/images/upload`
- Body: `{ "imageData": "data:image/jpeg;base64,...", "folder": "gallery" }`

### Get All Images
- **GET** `/api/images`

### Get Single Image
- **GET** `/api/images/:id`

### Delete Image
- **DELETE** `/api/images/:id`

### Health Check
- **GET** `/health`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations 