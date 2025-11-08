import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserProfile } from "../api/api";

export const useUserProfile = (username) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (!auth.token || !username) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getUserProfile(username, auth.token);
        setProfile(response.data);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 404) {
          setError("Pengguna tidak ditemukan");
        } else {
          setError("Gagal memuat profil");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, auth.token]);

  return { profile, error, loading };
};
