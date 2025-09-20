// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import API from "@/utils/api";
import Link from "next/link";
import PollCard from "@/components/PollCard";

export default function Home() {
  const [polls, setPolls] = useState<any[]>([]);
  useEffect(() => {
    API.get("/polls").then(r=>setPolls(r.data)).catch(console.error);
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Available Tests</h1>
      <div className="grid gap-4">
        {polls.map(p => <PollCard key={p._id} poll={p} />)}
      </div>
    </div>
  );
}
