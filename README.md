# LearnForge — Course Selling Platform

A production-ready Udemy-style course selling platform with a modern black-and-white UI.

## Tech Stack

**Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt, cookie-parser  
**Frontend:** React, Vite, Tailwind CSS, Axios, React Router DOM, Context API

---

## Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── courseController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── adminMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Course.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── courseRoutes.js
│   │   ├── utils/generateToken.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── CourseCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Courses.jsx
    │   │   ├── CourseDetails.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── MyCourses.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── CreateCourse.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`  
Backend runs at `http://localhost:5000`

---

## API Endpoints

| Method | Path | Access |
|--------|------|--------|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Public |
| GET | `/api/auth/profile` | Authenticated |
| GET | `/api/courses` | Public |
| GET | `/api/courses/:id` | Public |
| POST | `/api/courses/create` | Admin |
| PUT | `/api/courses/update/:id` | Admin |
| DELETE | `/api/courses/delete/:id` | Admin |
| POST | `/api/courses/buy/:id` | Authenticated |
| GET | `/api/courses/my-courses` | Authenticated |

---

## Features

- JWT authentication stored in `httpOnly` cookies
- Role-based access control (user / admin)
- Admin: create, edit, delete courses
- Users: browse, search, purchase, view enrolled courses
- Responsive black-and-white UI with custom typography
- Real-time search filtering on courses page
- Sticky purchase card on course detail page
- Inline confirm-before-delete in admin dashboard
