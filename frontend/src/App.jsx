import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { Loader2 } from "lucide-react";

function App() {
  const { auth, isAuthLoading } = useContext(AuthContext);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/post/:id/:slug" element={<PostDetailPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />

          {/* Rute dilindungi */}
          <Route
            path="/create-post"
            element={auth.token ? <CreatePostPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/post/:id/:slug/edit"
            element={auth.token ? <EditPostPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={
              auth.user && auth.user.role === "admin" ? (
                <AdminDashboardPage />
              ) : (
                <LoginPage />
              )
            }
          />
        </Routes>
      </main>
      <Toaster />
    </Router>
  );
}

export default App;
