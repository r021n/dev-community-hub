import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { auth, logout, socket } = useContext(AuthContext);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentSocket = socket.current;
    if (currentSocket) {
      currentSocket.on("newNotification", (data) => {
        setNotification(data);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
    }

    return () => {
      if (currentSocket) {
        currentSocket.off("newNotification");
      }
    };
  }, [socket.current]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header>
      {notification && (
        <div
          style={{
            background: "lightblue",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <Link to={`/post/${notification.postId}/${notification.slug}`}>
            {notification.message}
          </Link>
        </div>
      )}
      <div
        style={{
          background: "#333",
          color: "white",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="logo">
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            <h1>Dev Community Hub</h1>
          </Link>
        </div>
        <nav>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              gap: "15px",
            }}
          >
            {!auth.token ? (
              <>
                <li>
                  <Link
                    to="/login"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to={`/profile/${auth.user.username}`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Profil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-post"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Buat Post
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: "none",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "1rem",
                    }}
                  >
                    logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        {auth.user && auth.user.role === "admin" && (
          <Link to="/admin" style={{ color: "white", marginRight: "1rem" }}>
            Admin
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
