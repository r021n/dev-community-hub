# Dev Community Hub - Backend API

This directory contains the complete source code for the Dev Community Hub's backend service. It is a robust RESTful API and WebSocket server built with Node.js, Express, and PostgreSQL, responsible for all business logic, data persistence, and real-time communication.

---

## Core Features

- **Secure Authentication:** Implements JWT (JSON Web Token) for stateless authentication, with secure password hashing via `bcrypt`.
- **RESTful API:** Provides a full suite of endpoints for managing users, posts, comments, and likes, following REST principles.
- **Real-time Notifications:** Utilizes `Socket.io` to push live notifications to clients (e.g., when a user's post receives a new comment).
- **Advanced Database Features:** Leverages PostgreSQL's native Full-Text Search for efficient and powerful search capabilities.
- **Relational Data Model:** Manages complex relationships, including many-to-many (posts-to-tags) and self-referencing (nested comments).
- **Role-Based Access Control (RBAC):** Includes middleware to protect specific endpoints, restricting access to authorized roles (e.g., 'admin').

---

## Tech Stack

| Category                    | Technology / Library           |
| --------------------------- | ------------------------------ |
| **Runtime**                 | Node.js (v18.x)                |
| **Framework**               | Express.js                     |
| **Database**                | PostgreSQL                     |
| **Database Client**         | `pg` (node-postgres)           |
| **Authentication**          | `jsonwebtoken`, `bcrypt`       |
| **Real-time Communication** | `Socket.io`                    |
| **Environment Variables**   | `dotenv`                       |
| **Development Tooling**     | `nodemon` (for auto-reloading) |

---

## API Endpoints

A summary of the available API endpoints. `(Protected)` routes require a valid JWT `Bearer` token in the `Authorization` header.

### Authentication (`/api/auth`)

| Method | Endpoint    | Description                        |
| ------ | ----------- | ---------------------------------- |
| `POST` | `/register` | Registers a new user.              |
| `POST` | `/login`    | Authenticates a user, returns JWT. |

### Users (`/api/users`)

| Method | Endpoint   | Description                      |
| ------ | ---------- | -------------------------------- |
| `GET`  | `/profile` | Get profile of the current user. |

### Posts (`/api/posts`)

| Method | Endpoint    | Description                                         |
| ------ | ----------- | --------------------------------------------------- |
| `GET`  | `/`         | Get all posts. Supports `?search` & `?tag` queries. |
| `POST` | `/`         | Create a new post. `(Protected)`                    |
| `GET`  | `/:id`      | Get a single post by ID.                            |
| `POST` | `/:id/like` | Toggle a like on a post. `(Protected)`              |

### Comments (`/api/posts/:postId/comments`)

| Method | Endpoint | Description                         |
| ------ | -------- | ----------------------------------- |
| `GET`  | `/`      | Get all comments for a post.        |
| `POST` | `/`      | Create a new comment. `(Protected)` |

### Admin (`/api/admin`)

| Method | Endpoint | Description                                       |
| ------ | -------- | ------------------------------------------------- |
| `GET`  | `/stats` | Get platform analytics. `(Protected, Admin Only)` |

---

## Local Setup & Installation

1.  **Prerequisites:**

    - Node.js & npm
    - PostgreSQL Server

2.  **Navigate to this directory:**

    ```sh
    cd backend
    ```

3.  **Install dependencies:**

    ```sh
    npm install
    ```

4.  **Environment Variables:**
    Create a `.env` file in this directory by copying the example file:

    ```sh
    cp .env.example .env
    ```

    Open the `.env` file and populate it with your local PostgreSQL credentials and a strong, unique `JWT_SECRET`.

5.  **Database Setup:**

    - Ensure your PostgreSQL server is running.
    - Create a database (e.g., `dev_community`).
    - Execute the SQL scripts in this directory against your database in the following order:
      1.  `init.sql`
      2.  `update_schema.sql`
      3.  `add_role.sql`

6.  **Run the Server:**
    For development with auto-reloading:
    ```sh
    npm run dev
    ```
    For production:
    ```sh
    npm start
    ```
    The API server will be running on `http://localhost:3001`.

---

## Project Structure

```
/backend
├── /controllers    # Handles request/response logic, calls services
├── /middleware     # Express middleware (e.g., auth, admin checks)
├── /routes         # Defines API endpoints and maps them to controllers
├── /services       # Contains business logic and database interactions
├── .env.example    # Example environment variables
├── db.js           # PostgreSQL connection pool setup
├── index.js        # Main server entry point (Express & Socket.io setup)
└── package.json    # Project dependencies and scripts
```
