# 📝 Odin Book (monorepo)

A social media application built with **Node.js**, **Express** and **PostgreSQL**. Developed as the final project of [The Odin Project's Node.js curriculum](https://www.theodinproject.com/lessons/node-path-nodejs-odin-book), this app demonstrates full-stack capabilities including structured database interactions via **Prisma ORM**.

## 🚀 Features

- User registration and authentication
- Login OAuth2 for Google and GitHub
- PostgreSQL database integration via Prisma
- Secure password handling (hasing + salting) with bcrypt
- Timestamps for messages
- Profile customisation
- Image attachments using [Cloudinary](https://cloudinary.com/)'s hosting
- Display of online users

## 🧱 Tech Stack

### Backend

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Prisma ORM**
- **dotenv**
- **bcrypt/uuid**
- **Multer middleware**
- **JWT strategy**
- **CORS**
- **Faker library**

### Frontend libraries

- **React**
- **Tailwind**
- **Lucide-react**

## 📁 Project Structure

```
messaging-app/
│
├── server/                # Express backend
│   ├── controllers/       # Middleware folder
│   ├── db/                # Prisma/SQL queries
│   ├── routes/            # Route definitions
│   ├── prisma/            # Prisma schema and migrations
│   ├── services/          # E.g. feed service to create guest logins
│   ├── utils/             # Helper js functions
│   ├── app.js             # Express app setup
│   └── .env               # Environment variables
│
├── client/                # React + Tailwind + Shadcn/UI frontend
│   ├── dist/              # Vite output folder
│   ├── public/            # Favicons
│   ├── src/               # Middleware folder
│   │   ├── components/    # Main components
│   │   │       └── ui/    # Extra UI elements
│   │   ├── contexts/      # Context API
│   │   ├── hooks/         # Hooks for Context API
│   │   └── providers/     # Reusable functions and hooks
│   ├── .env
│   ├── App.jsx            # Route for main feed
│   ├── main.jsx           # Starting point
│   ├── PostDetails.jsx    # Route when looking at post details
│   ├── ProfileDetails.jsx # Route when looking at user's details
│   ├── Routes.jsx         # React Router
│   └── Settings.jsx       # Route when looking at settings page
│
└── README.md             # Project overview
```

## API Routes / Endpoints

### Auth Router (`/auth`)

| Method | Route              | Description                                           |
| ------ | ------------------ | ----------------------------------------------------- |
| GET    | `/github`          | Initiates GitHub OAuth authentication flow            |
| GET    | `/github/callback` | Handles GitHub OAuth callback and user creation/login |
| GET    | `/google`          | Initiates Google OAuth authentication flow            |
| GET    | `/google/callback` | Handles Google OAuth callback and user creation/login |
| POST   | `/signup`          | Creates new user account with email/password          |
| POST   | `/login`           | Authenticates user with email/password                |
| POST   | `/guest`           | Creates temporary guest user account                  |

### User Router (`/user`)

| Method | Route                   | Description                                    |
| ------ | ----------------------- | ---------------------------------------------- |
| GET    | `/me`                   | Retrieves current authenticated user's profile |
| GET    | `/users/:userId`        | Fetches user profile by user ID                |
| GET    | `/users/handle/:handle` | Fetches user profile by handle/username        |
| GET    | `/checkOwnLike`         | Checks if current user liked a specific post   |
| PUT    | `/users`                | Updates user profile information               |
| DELETE | `/users/:userId`        | Deletes user account                           |

### Post Router (`/post`)

| Method | Route                          | Description                                                |
| ------ | ------------------------------ | ---------------------------------------------------------- |
| GET    | `/posts/:postId/details`       | Retrieves detailed information for a specific post         |
| GET    | `/posts/:postId/replies`       | Fetches all replies/comments for a specific post           |
| GET    | `/posts`                       | Retrieves paginated feed of all posts with optional search |
| GET    | `/users/:specificUserId/posts` | Fetches all posts from a specific user                     |
| POST   | `/posts`                       | Creates a new post with optional image                     |
| POST   | `/comments`                    | Creates a new comment/reply to a post                      |
| POST   | `/likes`                       | Toggles like status on a post                              |
| POST   | `/retweets`                    | Toggles retweet status on a post                           |
| DELETE | `/posts/:postId`               | Deletes a specific post                                    |

### Follow Router (`/follow`)

| Method | Route             | Description                                        |
| ------ | ----------------- | -------------------------------------------------- |
| POST   | `/follow`         | Toggles follow relationship between users          |
| POST   | `/followers`      | Retrieves follower/following data for a user       |
| POST   | `/followingposts` | Fetches posts from users that current user follows |

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma CLI](https://www.prisma.io/)

### Setup (Backend)

```bash
# Clone the repo
git clone https://github.com/jonorl/odin-book.git
cd odin-book

# Navigate to backend
cd server

# Install dependencies
npm install

# Set up database and run migrations
npx prisma migrate dev --name init

# Start the server
node --watch app.js
```

Server runs at: `http://localhost:3000`

### Setup (frontend)

```bash
# Navigate to frontend
cd client

# Install dependencies
npm install

# Start the client
npm run dev
```

### Setup (database)

```bash
# Initiate db
npx prisma migrate dev --name init
```

Client runs at: `http://localhost:5173`

### .env file (backend)

```bash
PORT=3000
PRODUCTION_DATABASE_URL=YOUR_DB_URL
JWT_SECRET=CHOOSE_A_STRONG_SECRET
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUDNAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API
GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_GITHUB_SECRET
GITHUB_REDIRECT_URI=http://localhost:3000/api/v1/auth/github/callback
SESSION_SECRET=YOUR_SESSION_SECRET_WORK
FRONTEND_URL=http://localhost:5173/
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_SECRET
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback
```

### .env file (frontend)

```bash
VITE_LOCALHOST=http://localhost:3000
VITE_THISHOST=http://localhost:5173
```

🚀 Deployment

- Frontend: Cloudflare --> https://odin-book.pages.dev/
- Backend: Render --> https://odin-book-snve.onrender.com/
- PostgreSql: Neon --> https://neon.tech/
- Image Hosting: Cloudinary --> https://cloudinary.com/

- [live version](https://odin-book.pages.dev/)

![Odin Book Screenshot](https://res.cloudinary.com/dqqdfeuo1/image/upload/v1754577758/Screenshot_2025-08-07_174225_upzgrc.png "Screenshot of my Odin Book")

## 🧱 To-do

- Tidy up code! Eliminate non-used queries + API routes
- Notifications
- Addigs GIFs
- Adding polls
- Add searchbar for mobile users
- Right sidebar "What's Happening" and "Who to follow" sections are hardcoded

## 👨‍💻 Author

**Jonathan Orlowski**
_[GitHub](https://github.com/jonorl)
_[LinkedIn](https://www.linkedin.com/in/jonathan-orlowski-58910b21/)

> 📚 This project is part of [The Odin Project](https://www.theodinproject.com/), a free and open-source curriculum for aspiring full-stack web developers.
