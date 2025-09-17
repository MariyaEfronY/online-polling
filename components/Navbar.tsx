"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, clearToken } from "../lib/auth";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Runs only on client
    setToken(getToken());
  }, []);

  return (
    <nav className="flex gap-4 p-4 bg-gray-200">
      <Link href="/">Home</Link>
      {token ? (
        <>
          <Link href="/polls/create">Create Poll</Link>
          <button
            onClick={() => {
              clearToken();
              setToken(null); // clear state
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
    </nav>
  );
}
