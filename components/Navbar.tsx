"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, clearToken } from "../lib/auth";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken());
  }, []);

  return (
    <nav className="flex gap-6 p-4 bg-blue-600 text-white shadow">
      <Link href="/" className="font-bold">PollingApp</Link>
      <div className="flex gap-4">
        {token ? (
          <>
            <Link href="/polls/create">Create Poll</Link>
            <Link href="/dashboard">Dashboard</Link>
            <button
              onClick={() => {
                clearToken();
                setToken(null);
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
