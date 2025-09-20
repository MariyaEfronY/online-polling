"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function StaffSignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/signup", { username, email, password });
      localStorage.setItem("token", res.data.token); // save staff token
      router.push("/staff/create-poll"); // redirect after signup
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Staff Signup</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Username"
          className="border px-3 py-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Signup
        </button>
      </form>
    </div>
  );
}
