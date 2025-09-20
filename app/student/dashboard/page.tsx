// app/student/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import API from "@/utils/api";
import { getToken } from "@/utils/clientAuth";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) { router.push("/student/login"); return; }
    API.get("/dashboard/student").then(r => setData(r.data.results)).catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Results</h1>
      <ul>
        {data.map(item => (
          <li key={item.pollId} className="mb-3">
            <div>{item.question}</div>
            <div>Selected: {item.optionIndex} — {item.isCorrect ? "Correct" : "Incorrect"}</div>
            <div className="text-sm text-gray-500">{new Date(item.submittedAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
