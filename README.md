# EduCloud - E-Learning Platform

EduCloud is a modern, full-stack e-learning platform built with the MERN stack (MongoDB, Express, React, Node.js). It enables instructors to create and manage courses (with S3 video streaming) and quizzes, while students can enroll, consume content, and test their knowledge.

---

## 🛠 Tech Stack

### Frontend
- **React.js (Vite)**: Fast, modern UI.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **React Router**: For declarative routing.
- **Axios**: HTTP client with request interceptors for JWT injection.
- **Lucide React**: Vector icons.

### Backend
- **Node.js & Express**: Lightweight, fast, and scalable server.
- **MongoDB & Mongoose**: NoSQL database for flexible schemas.
- **JWT (JSON Web Tokens)**: Secure, stateless authentication.
- **AWS S3 (@aws-sdk/client-s3)**: For robust course video and thumbnail cloud storage.
- **Multer (multer-s3)**: For direct-to-bucket multi-part form uploads.

---

## 🏗 Architecture Overview

*(Placeholder for Architecture Diagram)*

1. **Client Layer**: The Vite/React single-page application handles UI/UX and stores authentication tokens securely in Local Storage.
2. **API Layer**: The Node/Express server validates JWTs via middleware and acts as the gatekeeper.
3. **Storage Layer**: 
   - Metadata, Users, Quizzes, and Course metadata live in **MongoDB**.
   - Heavy media assets (MP4 Videos) are streamed directly from **AWS S3**.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI
- An AWS Account with an S3 Bucket provisioned

### 1. Clone & Install
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/elearning
JWT_SECRET=your_super_secret_jwt_key
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name
```

### 3. Database Seeding (Optional)
To quickly populate your database with dummy users, courses, and quizzes for testing:
```bash
cd backend
npm run seed
```
**Test Credentials:**
- Instructor: `john@instructor.com` / `password123`
- Student: `alice@student.com` / `password123`

### 4. Run the Application
You need to run both the frontend and backend servers.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
The app will be accessible at `http://localhost:5173`.

---

## 📡 API Endpoints Table

| Method | Endpoint | Description | Protected | Role |
| :--- | :--- | :--- | :---: | :---: |
| **POST** | `/api/auth/register` | Register new user | No | Any |
| **POST** | `/api/auth/login` | Login user | No | Any |
| **GET** | `/api/auth/profile` | Get current user data | Yes | Any |
| **GET** | `/api/courses` | Fetch all courses | No | Any |
| **GET** | `/api/courses/:id` | Fetch specific course | No | Any |
| **POST** | `/api/courses` | Create new course (Multipart) | Yes | Instructor |
| **DELETE** | `/api/courses/:id` | Delete course & S3 Video | Yes | Instructor |
| **POST** | `/api/courses/:id/enroll` | Enroll student in course | Yes | Student |
| **POST** | `/api/quizzes` | Create a quiz for a course | Yes | Instructor |
| **GET** | `/api/quizzes/course/:id` | Get all quizzes in a course | Yes | Any |
| **POST** | `/api/quizzes/:id/submit` | Submit answers for grading | Yes | Student |

---

## 📦 Postman Collection

A complete Postman Collection is included in the repository root (`postman_collection.json`). Import it into Postman to easily test all endpoints!

---

## 📸 Screenshots
*(Placeholder for Screenshots)*

## 👥 Team Members
*(Placeholder for Team Members)*
