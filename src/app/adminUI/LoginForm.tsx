"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Both fields are required!");
      return;
    }

    const response = await fetch("/admin/login/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      setMessage("Login successful!");
      setTimeout(() => router.push("/dashboard/home"), 2000);
    } else {
      setMessage(data.error || "Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Login</h2>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>

        {/* New User Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          New User?{" "}
          <a href="/admin/adminForm" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
