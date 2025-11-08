import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { useUserProfile } from "../hooks/useUserProfile";

const ProfilePage = () => {
  const { auth } = useContext(AuthContext);
  const { username } = useParams();
  const { profile, error, loading } = useUserProfile(username);

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

  if (!profile) {
    return <p>Profil tidak ditemukan atau sedang dimuat...</p>;
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
          <PostCard key={post.id} post={post} showAuthor={false} />
        ))
      ) : (
        <p>Pengguna ini belum membuat postingan apapun.</p>
      )}
    </div>
  );
};

export default ProfilePage;
