import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.token) return;

      try {
        const response = await axios.get(
          "http://localhost:3001/api/users/profile",
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        setProfile(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
        setError("Gagal memuat profil");
      }
    };
    fetchProfile();
  }, [auth.token]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }
  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Profil Pengguna</h2>
      <p>
        <strong>Username: </strong>
        {profile.username}
      </p>
      <p>
        <strong>Bergabung pada:</strong>{" "}
        {new Date(profile.created_at).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ProfilePage;
