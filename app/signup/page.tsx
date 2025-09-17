"use client";
import { useState } from "react";
import API from "../../utils/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);
      alert("Signup successful. Please login.");
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        className="w-full mb-3 p-2 border rounded"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="w-full bg-primary text-white py-2 rounded">
        Register
      </button>
    </form>
  );
}
