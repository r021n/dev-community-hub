import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import { loginApi } from "../api/api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.token !== null) {
      navigate("/");
    }
  }, [auth.token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await loginApi(username, password);
      login(response.data.token);
      navigate("/");
    } catch (error) {
      setError("Username atau password salah");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <FormField
          label="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
