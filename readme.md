# Dev Community Hub

![Project Banner](https://via.placeholder.com/1200x300.png?text=Dev+Community+Hub)

**Dev Community Hub** is a full-stack web application designed to be a feature-rich platform for developers to connect, share knowledge, and showcase their skills. It includes user authentication, a post and comment system with nested replies, real-time notifications, full-text search, and an admin dashboard for analytics.

This project serves as a comprehensive guide and a practical example of building a modern, production-ready web application using the PERN stack (PostgreSQL, Express, React, Node.js) along with advanced features like WebSockets and CI/CD pipelines.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.x-blue.svg)](https://www.postgresql.org/)

---

## Live Demo

**(Link to your deployed application will go here)**

`[Link to Deployed Frontend]` | `[Link to API Base URL]`

---

## Features

### 👤 User & Authentication

- **JWT-based Authentication:** Secure user registration and login using JSON Web Tokens.
- **Password Hashing:** Passwords are securely hashed using `bcrypt` before being stored.
- **User Profiles:** Users can view and (in future versions) update their profiles.
- **Protected Routes:** Critical routes and actions are protected and require a valid token.

### 💬 Core Functionality

- **CRUD for Posts:** Authenticated users can create, read, update, and delete posts.
- **Tagging System:** Posts can be categorized with skill tags (e.g., #react, #nodejs).
- **Nested Comments:** A hierarchical comment system that supports multi-level replies.
- **Like/Unlike System:** Users can like and unlike posts to show appreciation.

### ✨ Advanced Features

- **Real-time Notifications:** Receive instant notifications via WebSockets (`Socket.io`) when someone comments on your post.
- **Full-Text Search:** A powerful search engine implemented using PostgreSQL's native FTS (`to_tsvector`, `to_tsquery`) to search post titles and content.
- **Tag-based Filtering:** Filter posts on the homepage by clicking on a specific tag.

### 📊 Admin Dashboard

- **Role-Based Access Control (RBAC):** A dedicated dashboard accessible only to users with an 'admin' role.
- **Data Analytics:** View key platform statistics (total users, posts, comments, likes).
- **Data Visualization:** Platform stats are visualized using `Chart.js` for easy interpretation.

### 🚀 DevOps & Deployment

- **Dockerized Backend:** The Node.js application and PostgreSQL database are containerized using Docker and Docker Compose for consistent development environments.
- **CI/CD Pipeline:** Automated testing and deployment pipeline configured with GitHub Actions.
- **Separate Deployments:** The backend is deployed on a service like Render/Heroku, and the frontend on Vercel/Netlify for optimal performance and scalability.

---

## Tech Stack

| Category       | Technologies & Libraries                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Frontend**   | `React`, `Vite`, `React Router`, `Axios`, `Socket.io-client`, `Chart.js`, `jwt-decode`                             |
| **Backend**    | `Node.js`, `Express.js`, `PostgreSQL`, `Socket.io`, `jsonwebtoken`, `bcrypt`, `pg` (node-postgres)                 |
| **Database**   | `PostgreSQL`                                                                                                       |
| **DevOps**     | `Docker`, `Docker Compose`, `GitHub Actions`                                                                       |
| **Deployment** | `Render` / `Heroku` (Backend), `Vercel` / `Netlify` (Frontend), `ElephantSQL` / `Managed DB` (Production Database) |

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x or later)
- [PostgreSQL](https://www.postgresql.org/download/) (v14.x or later)
- [Git](https://git-scm.com/)
- A package manager like `npm` or `yarn`

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/r021n/dev-community-hub.git
    cd dev-community-hub
    ```

2.  **Backend Setup:**

    ```sh
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create a .env file by copying the example
    cp .env.example .env
    ```

    Now, open `backend/.env` and fill in your PostgreSQL database credentials and a secure `JWT_SECRET`.

    ```env
    # backend/.env
    DB_USER=your_db_user
    DB_HOST=localhost
    DB_DATABASE=dev_community
    DB_PASSWORD=your_db_password
    DB_PORT=5432
    JWT_SECRET=your_super_secret_and_long_jwt_key
    ```

    **Initialize the database:**

    - Make sure your PostgreSQL server is running.
    - Create a new database named `dev_community`.
    - Run the SQL scripts located in the `backend` directory against your new database in the following order:
      1.  `init.sql`
      2.  `update_schema.sql`
      3.  `add_role.sql`

    **Start the backend server:**

    ```sh
    npm start
    # The server will run on http://localhost:3001
    ```

3.  **Frontend Setup:**

    ```sh
    # Open a new terminal and navigate to the frontend directory
    cd frontend

    # Install dependencies
    npm install

    # (Optional) Create a .env file if you need to override the default API URL
    # cp .env.example .env
    ```

    **Start the frontend development server:**

    ```sh
    npm run dev
    # The React app will be available at http://localhost:5173 (or another port if 5173 is busy)
    ```

You should now have the application running locally! Register a new user to get started. To test admin features, you will need to manually update a user's `role` in the `users` table to `'admin'`.

---

## API Endpoints Overview

A brief overview of the core API endpoints. All `(Protected)` routes require a `Bearer <token>` in the `Authorization` header.

| Method | Endpoint                      | Description                                  | Protected        |
| ------ | ----------------------------- | -------------------------------------------- | ---------------- |
| `POST` | `/api/auth/register`          | Register a new user.                         | No               |
| `POST` | `/api/auth/login`             | Log in a user and receive a JWT.             | No               |
| `GET`  | `/api/users/profile`          | Get the profile of the logged-in user.       | Yes              |
| `GET`  | `/api/posts`                  | Get all posts (supports `?search` & `?tag`). | No               |
| `POST` | `/api/posts`                  | Create a new post.                           | Yes              |
| `GET`  | `/api/posts/:id`              | Get a single post by its ID.                 | No               |
| `POST` | `/api/posts/:id/like`         | Toggle like/unlike on a post.                | Yes              |
| `GET`  | `/api/posts/:postId/comments` | Get all comments for a post.                 | No               |
| `POST` | `/api/posts/:postId/comments` | Add a new comment to a post.                 | Yes              |
| `GET`  | `/api/admin/stats`            | Get dashboard analytics.                     | Yes (Admin only) |

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  **Fork** the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

---

## Contact

Project Link: [https://github.com/r021n/dev-community-hub.git](https://github.com/r021n/dev-community-hub.git)
