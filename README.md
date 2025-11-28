# Blogify - Full Stack Blog Application

A modern, full-featured blog platform built with React, Node.js, Express, and MongoDB.

## Features Implemented

### ✅ Authentication

- User registration and login
- JWT-based authentication
- Protected routes
- Persistent sessions with Zustand

### ✅ Blog Posts

- Create new posts with cover images
- Edit existing posts
- Delete posts
- View post details
- Like/Unlike posts
- Tag system
- Slug-based URLs

### ✅ User Features

- User profiles
- Personal dashboard
- View user statistics
- View posts by author

### ✅ UI Components

- Responsive design with Tailwind CSS
- Modern navigation bar
- Post cards with previews
- Image upload with preview
- Loading states

## Tech Stack

### Frontend

- **React 19** - UI framework
- **React Router DOM** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Icons** - Icons
- **Vite** - Build tool

### Backend

- **Node.js & Express** - Server
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image storage
- **Joi** - Validation

## Project Structure

```
blogify/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── PostCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Loginpage.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── NewPost.jsx
│   │   │   ├── EditPost.jsx
│   │   │   ├── PostDetail.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   ├── useAuthStore.js
│   │   │   └── usePostStore.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
└── server/
    ├── src/
    │   ├── config/
    │   │   └── db.js
    │   ├── controller/
    │   │   ├── auth.controller.js
    │   │   ├── post.controller.js
    │   │   └── comment.controller.js
    │   ├── middleware/
    │   │   ├── protect.js
    │   │   ├── multer.middleware.js
    │   │   └── cloudinaryUpload.middleware.js
    │   ├── models/
    │   │   ├── user.js
    │   │   ├── post.js
    │   │   └── comment.js
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── post.js
    │   │   └── comment.js
    │   ├── utility/
    │   │   ├── cloudinary.js
    │   │   └── generateToken.js
    │   ├── validation/
    │   │   ├── auth.validation.js
    │   │   └── post.js
    │   └── index.js
    ├── .env.example
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from the example:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/blogify
JWT_SECRET=your_super_secret_jwt_key_change_this
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Start the server:

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from the example:

```bash
cp .env.example .env
```

4. Update the `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

5. Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts

- `GET /api/post` - Get all posts (with filters)
- `GET /api/post/:id` - Get single post
- `POST /api/post` - Create new post (protected)
- `PUT /api/post/:id` - Update post (protected)
- `DELETE /api/post/:id` - Delete post (protected)
- `PUT /api/post/:id/like` - Like/Unlike post (protected)

### Comments

- `GET /api/comments/:postId` - Get comments for a post
- `POST /api/comments` - Add comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

## Routes

### Public Routes

- `/` - Home page (all posts)
- `/login` - Login page
- `/register` - Registration page
- `/post/:id` - View post detail

### Protected Routes

- `/post/new` - Create new post
- `/post/edit/:id` - Edit post
- `/profile` - User profile
- `/dashboard` - User dashboard

## Key Features by Page

### Home Page

- Display all blog posts
- Post cards with preview
- Click to view full post

### Post Detail Page

- Full post content
- Like/Unlike functionality
- Edit/Delete buttons (for author)
- Author information

### Create/Edit Post

- Rich form with validation
- Image upload with preview
- Tag management
- Cancel option

### Dashboard

- Statistics (total posts, likes, views)
- Manage all user posts
- Quick actions (view, edit, delete)

### Profile

- User information
- User's posts
- Edit profile option

## Environment Variables

### Backend (.env)

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Frontend (.env)

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## What's Still Missing

### Backend

- Comment routes not registered in main index.js
- Follow/Unfollow functionality
- Email verification
- Password reset
- User profile update endpoint

### Frontend

- Comment display component
- Comment form component
- Rich text editor integration (Lexical installed but not used)
- Search functionality UI
- Filter by tags UI
- Pagination UI
- Toast notifications
- Edit profile page
- Dark mode

## Future Enhancements

1. **Rich Text Editor** - Implement Lexical for better content editing
2. **Comments System** - Build UI for nested comments
3. **Search & Filters** - Add search bar and tag filters
4. **Notifications** - Toast notifications for actions
5. **Profile Editing** - Allow users to update profile
6. **Social Features** - Follow/unfollow users
7. **Email Features** - Email verification, password reset
8. **Pagination** - Add pagination to post lists
9. **Responsive Design** - Mobile optimization
10. **Dark Mode** - Theme toggle

## Scripts

### Backend

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using React, Node.js, and MongoDB**
