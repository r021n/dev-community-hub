# Dev Community Hub - Frontend Client

This directory contains the source code for the Dev Community Hub's frontend client. It is a modern, single-page application (SPA) built with React and Vite, providing a dynamic and interactive user interface that consumes the backend API.

---

## Core Features

- **Modern UI/UX:** Built with React for a component-based, declarative, and efficient user interface.
- **Fast Development Experience:** Leverages Vite for lightning-fast Hot Module Replacement (HMR) and an optimized build process.
- **Client-Side Routing:** Seamless navigation between pages without full-page reloads, handled by `React Router`.
- **Global State Management:** Manages global authentication state (user, token) cleanly across the application using React's Context API.
- **Real-time Interactivity:** Listens for WebSocket events from the backend to display instant notifications to users.
- **Data Visualization:** Renders an analytics chart on the admin dashboard using `Chart.js`.
- **Dynamic Search & Filtering:** UI components allow users to search for posts and filter them by tags, with results reflected in the URL query parameters.

---

## Tech Stack

| Category                    | Technology / Library          |
| --------------------------- | ----------------------------- |
| **Framework/Library**       | React (v18.x)                 |
| **Build Tool**              | Vite                          |
| **Routing**                 | `react-router-dom`            |
| **HTTP Client**             | `axios`                       |
| **Real-time Communication** | `socket.io-client`            |
| **State Management**        | React Context API             |
| **Data Visualization**      | `chart.js`, `react-chartjs-2` |
| **Utility**                 | `jwt-decode`                  |

---

## Local Setup & Installation

1.  **Prerequisites:**

    - Node.js & npm
    - **The backend server must be running** for the frontend to fetch data.

2.  **Navigate to this directory:**

    ```sh
    cd frontend
    ```

3.  **Install dependencies:**

    ```sh
    npm install
    ```

4.  **Environment Variables (Optional):**
    This project is configured to connect to the backend at `http://localhost:3001` by default. If your backend is running on a different URL, create a `.env.local` file in this directory:

    ```
    # frontend/.env.local
    VITE_API_BASE_URL=http://your-backend-url.com
    ```

5.  **Run the Development Server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port). The browser window will open automatically.

---

## Available Scripts

In this directory, you can run the following commands:

- `npm run dev`: Starts the development server with HMR.
- `npm run build`: Bundles the app for production into the `dist` folder.
- `npm run lint`: Lints the project files for code quality.
- `npm run preview`: Serves the production build locally to preview it.

---

## Project Structure

```
/frontend
├── /src
│   ├── /components     # Reusable UI components (Header, Comment, etc.)
│   ├── /context        # Global state providers (e.g., AuthContext)
│   ├── /pages          # Top-level components for each route/page
│   ├── App.jsx         # Main application component with routing setup
│   ├── index.css       # Global styles
│   └── main.jsx        # Application entry point
├── .env.example        # Example environment variables
├── index.html          # Main HTML template
├── package.json        # Project dependencies and scripts
└── vite.config.js      # Vite configuration file
```

```

```
