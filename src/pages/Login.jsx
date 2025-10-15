import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../utils/api"; // ✅ no need to import setAuthToken anymore
import { LogIn } from "lucide-react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // ✅ Now login automatically stores tokens (handled inside api.js)
      const response = await api.login(email, password);

      if (response.accessToken || response.token) {
        navigate("/feed"); // Redirect to feed after successful login
      } else {
        throw new Error("No access token received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18230F] to-[#27391C] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-[#255F38] p-3 rounded-full">
            <LogIn className="text-white" size={32} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-[#18230F] mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in to continue to your account
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            variant="primary"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#255F38] hover:text-[#1F7D53] font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
