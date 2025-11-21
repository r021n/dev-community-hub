import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormField from "../components/FormField";
import { registerApi } from "../api/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password tidak boleh kurang dari 6 karakter");
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Register
          </CardTitle>
          <CardDescription className="text-center">
            Buat akun baru untuk memulai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormField
              label="Username:"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
            />
            <FormField
              label="Password:"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
            {error && (
              <p className="mt-2 mb-4 text-sm font-medium text-red-500">
                {error}
              </p>
            )}
            {success && (
              <p className="mt-2 mb-4 text-sm font-medium text-green-600">
                {success}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Login di sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
