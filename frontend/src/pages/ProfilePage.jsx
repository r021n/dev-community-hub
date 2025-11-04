import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);
  const { username } = useParams(); // Mengambil username dari URL

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Menggunakan endpoint baru dengan username
        const response = await axios.get(
          `http://localhost:3001/api/users/profile/${username}`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        setProfile(response.data);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 404) {
          setError("Pengguna tidak ditemukan.");
        } else {
          setError("Gagal memuat profil.");
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [username, auth.token]);

  // Jika user belum login, tampilkan pesan ini
  if (!auth.token) {
    return (
      <div>
        <h2>Profil Pengguna</h2>
        <p>
          Anda harus <Link to="/login">login</Link> untuk melihat profil
          pengguna.
        </p>
      </div>
    );
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Profil {profile.username}</h2>
      <p>
        <strong>Username: </strong>
        {profile.username}
      </p>
      <p>
        <strong>Bergabung pada:</strong>{" "}
        {new Date(profile.created_at).toLocaleDateString()}
      </p>

      <hr />
      <h3>Postingan oleh {profile.username}</h3>
      {profile.posts && profile.posts.length > 0 ? (
        profile.posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <h4>
              <Link to={`/post/${post.id}/${post.slug}`}>{post.title}</Link>
            </h4>
            <p>Dibuat pada: {new Date(post.created_at).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p>Pengguna ini belum membuat postingan apapun.</p>
      )}
    </div>
  );
};

export default ProfilePage;
