// app/student/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/utils/api";
import { saveToken } from "@/utils/clientAuth";

export default function StudentLogin() {
  const [dno, setDno] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await API.post("/auth/student/login", { dno, email });
      saveToken(res.data.token);
      router.push("/student/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Student sign in</h2>
      <input value={dno} onChange={e=>setDno(e.target.value)} placeholder="D.No" className="..." />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="..." />
      <button type="submit">Enter</button>
    </form>
  );
}
