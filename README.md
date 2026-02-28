# QuickHire - Job Board Platform

A modern, full-stack job board application that connects employers with job seekers. QuickHire provides an intuitive platform for posting jobs, browsing available positions, and managing applications.

## Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Job Listings**: Browse and search available job postings
- **Job Applications**: Apply to jobs and track application status
- **Admin Dashboard**: Post and manage job listings
- **Company Profiles**: View detailed company information
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Real-time Updates**: Server-side database integration with MongoDB

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **Next.js** - React framework for production
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Iconify** - Icon library

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** (local or MongoDB Atlas cloud) - [Download](https://www.mongodb.com/) or [Cloud](https://www.mongodb.com/cloud/atlas)
- **Git** - For version control

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/quickhire.git
cd quickhire
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory and add the following:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/quickhire
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickhire

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production

# Server Port
PORT=5000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

#### Start the Backend Server
```bash
# Development mode (with auto-restart on file changes)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

#### (Optional) Seed Database with Sample Data
```bash
npm run seed
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment Variables
Create a `.env.local` file in the `frontend` directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Start the Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

#### Build for Production
```bash
npm run build
npm start
```

## Environment Variables Reference

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/quickhire` |
| `JWT_SECRET` | Secret key for JWT token signing | Required for security |
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS configuration | `http://localhost:3000` |

### Frontend (.env.local)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

## Project Structure

```
quickhire/
├── backend/
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/              # Express route handlers
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   └── applications.js
│   ├── config/
│   │   └── db.js            # Database connection config
│   ├── server.js            # Express server setup
│   ├── seed.js              # Database seeding script
│   ├── package.json
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   │   ├── layout.js
│   │   │   ├── page.js
│   │   │   ├── admin/
│   │   │   ├── companies/
│   │   │   ├── jobs/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── components/      # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── ApplicationModal.jsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── api.js       # Axios API setup
│   │   └── styles/
│   │       └── globals.css
│   ├── public/              # Static assets
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.local           # Environment variables
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Post a new job (Admin)
- `PUT /api/jobs/:id` - Update job (Admin)
- `DELETE /api/jobs/:id` - Delete job (Admin)

### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Submit job application
- `PUT /api/applications/:id` - Update application status (Admin)
- `DELETE /api/applications/:id` - Delete application

