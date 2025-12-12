# Business Listing - MERN Stack Application

A full-stack web application for browsing and managing local business listings. Built with MongoDB, Express, React, and Node.js following strict MVC architecture on the backend.

## Features

- 🔍 **Search & Filter**: Search businesses by text, category, and location
- 📋 **Browse Listings**: Paginated listing view with sorting options (newest, A-Z)
- ⭐ **Bookmarks**: Save favorite businesses for quick access
- 📝 **CRUD Operations**: Create, edit, and delete your own business listings
- 👤 **User Authentication**: Secure JWT-based authentication with httpOnly cookies
- 📍 **Suggested Locations**: Quick filter panel with suggested locations
- 🎨 **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

### Backend
- Node.js 20+
- Express 4+
- MongoDB with Mongoose
- JWT authentication
- Zod validation
- Rate limiting
- Helmet security

### Frontend
- React 18+
- Vite
- React Router
- Zustand (state management)
- Tailwind CSS

## Project Structure

```
.
├── server/                 # Backend (MVC architecture)
│   ├── src/
│   │   ├── config/        # Database and environment config
│   │   ├── models/        # Mongoose models
│   │   ├── services/      # Business logic
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # Route definitions
│   │   ├── middlewares/   # Auth, validation, error handling
│   │   ├── utils/         # Helper functions
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Server entry point
│   ├── scripts/
│   │   └── seed.js        # Database seeding script
│   ├── test/              # Backend tests
│   └── package.json
│
└── client/                 # Frontend (React)
    ├── src/
    │   ├── app/           # App component and routing
    │   ├── pages/         # Page components
    │   ├── components/    # Reusable components
    │   ├── lib/           # API client
    │   ├── state/         # State management
    │   └── styles/        # CSS styles
    └── package.json
```

## Prerequisites

- Node.js 20+ installed
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Bussiness Listing Final"
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://mailrafiislam_db_user:PASSWORD@businesslisting.v8uly0q.mongodb.net/?appName=BusinessListing
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
COOKIE_NAME=auth_token
CORS_ORIGIN=http://localhost:5173
```

**Note**: 
- Update the `MONGO_URI` with your MongoDB connection string (replace `PASSWORD` with your actual MongoDB password)
- Set a strong `JWT_SECRET` for production use

### 3. Seed the Database

```bash
npm run seed
```

This will create:
- 1 admin user (admin@example.com / admin123)
- 2 regular users (john@example.com / user123, jane@example.com / user123)
- 5 categories
- 9 locations
- 20+ sample listings

### 4. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Available Scripts

### Backend

- `npm run dev` - Start development server with watch mode
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run seed` - Seed the database

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Listings
- `GET /api/listings` - Get paginated listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (auth required)
- `PUT /api/listings/:id` - Update listing (owner/admin only)
- `DELETE /api/listings/:id` - Delete listing (owner/admin only)
- `GET /api/listings/my-listings` - Get user's listings (auth required)

### User
- `GET /api/users/me/bookmarks` - Get user bookmarks (auth required)
- `POST /api/users/me/bookmarks/:listingId` - Toggle bookmark (auth required)

### Meta
- `GET /api/meta/categories` - Get all categories
- `GET /api/meta/locations` - Get all locations

### Admin
- `GET /api/admin/stats` - Get statistics (admin only)

## Testing

### Backend Tests

```bash
cd server
npm test
```

Tests include:
- Auth service unit tests
- Listing controller integration tests

### Frontend Tests

```bash
cd client
npm test
```

Tests include:
- ListingCard component render test

## Default Users

After seeding:

- **Admin**: admin@example.com / admin123
- **User 1**: john@example.com / user123
- **User 2**: jane@example.com / user123

## Architecture Notes

### Backend MVC Structure

- **Models**: Mongoose schemas with validation and indexes
- **Services**: Business logic (no direct database access in controllers)
- **Controllers**: Thin layer that calls services and formats responses
- **Routes**: Route definitions with middleware
- **Middlewares**: Authentication, validation, error handling, rate limiting

### Security Features

- JWT tokens stored in httpOnly cookies
- Password hashing with bcrypt
- Rate limiting on auth and write operations
- Helmet for security headers
- CORS configured for frontend origin only
- Input validation with Zod

## Environment Variables

### Backend (.env)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRE` - JWT expiration (default: 7d)
- `COOKIE_NAME` - Name of auth cookie
- `CORS_ORIGIN` - Allowed CORS origin

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## License

This project is for educational purposes.

## Screenshots

*Add screenshots of your application here*

---

Built with ❤️ using the MERN stack

