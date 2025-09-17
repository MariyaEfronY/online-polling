"use client";
import { useEffect, useState } from "react";
import API from "../utils/api";

export default function HomePage() {
  const [polls, setPolls] = useState<any[]>([]);

  useEffect(() => {
    API.get("/polls")
      .then((res) => setPolls(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Trending Polls</h1>
      <div className="grid gap-4">
        {polls.map((poll) => (
          <PollCard key={poll._id} poll={poll} />
        ))}
      </div>
    </div>
  );
}
