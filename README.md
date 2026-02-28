# QuickHire – Job Board Application

A full-stack job board application built for the Qtec Solution Limited technical assessment. Closely follows the provided Figma design with a complete frontend and backend implementation.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Validation | express-validator (backend), custom (frontend) |

---

## 📁 Project Structure

```
quickhire/
├── README.md
├── backend/
│   ├── server.js          # Express app entry point
│   ├── seed.js            # Database seeder (20 sample jobs)
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── models/
│   │   ├── Job.js         # Job schema
│   │   └── Application.js # Application schema
│   └── routes/
│       ├── jobs.js        # GET/POST/PUT/DELETE /api/jobs
│       └── applications.js# POST /api/applications
└── frontend/
    ├── next.config.js
    ├── tailwind.config.js
    └── src/
        ├── app/
        │   ├── page.js            # Landing page (/)
        │   ├── jobs/page.js       # Job listings (/jobs)
        │   ├── jobs/[id]/page.js  # Job detail (/jobs/:id)
        │   └── admin/page.js      # Admin panel (/admin)
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── JobCard.jsx        # Card + List variants
        │   └── CategoryCard.jsx
        ├── lib/
        │   └── api.js             # API utilities & helpers
        └── styles/
            └── globals.css
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI

# Start the server (development)
npm run dev

# OR start in production
npm start

# Seed the database with 20 sample jobs (optional)
npm run seed
```

**Backend `.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickhire
FRONTEND_URL=http://localhost:3000
```

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local if your backend runs on a different port

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

**Frontend `.env.local` file:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

The frontend will be available at **http://localhost:3000**

---

## 🌐 API Endpoints

### Jobs

| Method | Endpoint | Description | Params |
|--------|----------|-------------|--------|
| GET | `/api/jobs` | List all jobs | `search`, `category`, `location`, `type`, `featured`, `page`, `limit` |
| GET | `/api/jobs/:id` | Get single job | — |
| POST | `/api/jobs` | Create a job (Admin) | body: job fields |
| PUT | `/api/jobs/:id` | Update a job (Admin) | body: job fields |
| DELETE | `/api/jobs/:id` | Delete a job (Admin) | — |

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Submit an application |
| GET | `/api/applications` | List all applications (Admin) |
| GET | `/api/applications/job/:jobId` | Applications for a job |

### Health Check

```
GET /api/health
```

---

## 📦 Data Models

### Job
```js
{
  title: String,           // Required
  company: String,         // Required
  companyLogo: String,     // Single character logo
  location: String,        // Required
  category: String,        // Enum: Design, Sales, Marketing, Finance, Technology, Engineering, Business, Human Resources
  type: String,            // Enum: Full Time, Part Time, Contract, Internship, Remote
  description: String,     // Required
  requirements: String,
  salary: String,
  tags: [String],
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Application
```js
{
  job: ObjectId,           // Reference to Job
  name: String,            // Required
  email: String,           // Required, valid email
  resumeLink: String,      // Required, valid URL
  coverNote: String,       // Required, max 2000 chars
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Features Implemented

### Frontend
- ✅ **Landing Page** — Hero with search, category grid, featured jobs, latest jobs, CTA banner, footer
- ✅ **Job Listings Page** — Grid layout, search bar, sidebar filters (category, type, location), active filter chips, pagination
- ✅ **Job Detail Page** — Full description, requirements, salary, apply form, related jobs sidebar
- ✅ **Apply Now Form** — Name, email, resume link (URL), cover note with validation
- ✅ **Admin Panel** — Post new jobs (full form with all fields), delete jobs, view applications
- ✅ **Fully Responsive** — Mobile, tablet, and desktop layouts
- ✅ **Loading States** — Skeleton loaders on all data-fetching sections
- ✅ **Error Handling** — User-friendly error messages

### Backend
- ✅ All required REST endpoints
- ✅ Search & filter support on GET /api/jobs
- ✅ Input validation on all POST endpoints
- ✅ Email format validation
- ✅ URL format validation for resume links
- ✅ Proper error responses

### Bonus
- ✅ Loading states & UX enhancements
- ✅ Clean API response formatting `{ success, data, message }`
- ✅ Environment-based configuration
- ✅ Modular component architecture
- ✅ Pagination support

---

## 🎨 Design Implementation

The UI closely follows the provided Figma design:
- **Color scheme**: Deep indigo (`#4F3FF0`) primary, dark navy (`#0B0B2B`) hero
- **Typography**: Plus Jakarta Sans (Google Fonts)
- **Category grid**: 4×2 grid with icons, active state (Marketing highlighted)
- **Job cards**: Company color-coded logos, type badges, tag chips
- **Hero**: Dark navy background with geometric decorations and floating stat cards
- **CTA Banner**: Full-width primary color with dashboard preview

---

## 📝 Git Commit Strategy

Suggested commit order for clean history:
1. `feat: initial project setup (Next.js + Express)`
2. `feat: database models (Job, Application)`
3. `feat: backend API routes with validation`
4. `feat: database seeder with 20 sample jobs`
5. `feat: landing page with hero and category sections`
6. `feat: job listings page with search and filters`
7. `feat: job detail page with apply form`
8. `feat: admin panel with job management`
9. `style: responsive design and polish`
10. `docs: README and environment setup`

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel
# Set NEXT_PUBLIC_API_URL to your backend URL
```

### Backend → Railway / Render
```bash
# Connect GitHub repo
# Set environment variables: MONGODB_URI, FRONTEND_URL, PORT
# Deploy from root /backend directory
```

---

*Built with ❤️ for Qtec Solution Limited Technical Assessment*
