"use client";
import { useEffect, useState } from "react";
import API from "../../utils/api";
import { getToken } from "../../lib/auth";

export default function DashboardPage() {
  const [polls, setPolls] = useState<any[]>([]);

  useEffect(() => {
    if (!getToken()) {
      window.location.href = "/login";
      return;
    }

    API.get("/polls")
      .then((res) => {
        // Show only user's polls
        const myId = JSON.parse(atob(getToken()!.split(".")[1])).id;
        const myPolls = res.data.filter(
          (poll: any) => poll.createdBy?._id === myId
        );
        setPolls(myPolls);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Polls</h1>
      <ul className="space-y-2">
        {polls.map((poll) => (
          <li key={poll._id} className="p-4 bg-white shadow rounded">
            {poll.question}
          </li>
        ))}
      </ul>
    </div>
  );
}
