import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormField from "../components/FormField";
import { registerApi } from "../api/api";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password tidak boleh kurang dari 6 karakter");
      return;
    }

    try {
      await registerApi(username, password);
      setSuccess("Registrasi berhasil, anda akan diarahkan ke halaman login");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const respMsg = error?.response?.data?.message;
      setError(
        respMsg || "Terjadi kesalahan saat registrasi. Silahkan coba lagi nanti"
      );
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <FormField
          label="Username:"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormField
          label="Password:"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="submit">Register</button>
      </form>
      <p>
        Sudah punya akun? <Link to="/login">Login di sini</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
