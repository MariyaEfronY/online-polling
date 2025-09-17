"use client";
import { useState } from "react";
import API from "../../utils/api";
import { setToken } from "../../lib/auth";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", { username, email, password });
      setToken(res.data.token);
      window.location.href = "/";
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Signup</h1>
      <input
        type="text"
        placeholder="Username"
        className="w-full border p-2 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
        Signup
      </button>
    </form>
  );
}
