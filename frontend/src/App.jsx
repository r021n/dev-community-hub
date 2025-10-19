import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostPage from "./pages/CreatePostPage";

function App() {
  const { auth } = useContext(AuthContext);
  return (
    <Router>
      <Header />
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />

          {/* Rute dilindungi */}
          <Route
            path="/profile"
            element={auth.token ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/create-post"
            element={auth.token ? <CreatePostPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
