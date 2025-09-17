"use client";
import { useEffect, useState } from "react";
import API from "../utils/api";

export default function PollDetail({ poll }: { poll: any }) {
  const [localPoll, setLocalPoll] = useState(poll);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const vote = async (index: number) => {
    try {
      if (!token) {
        alert("Please login to vote");
        return;
      }

      await API.post(`/polls/${localPoll._id}/vote`, { optionIndex: index });

      // Refresh poll
      const updated = await API.get(`/polls/${localPoll._id}`);
      setLocalPoll(updated.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Vote failed");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{localPoll.question}</h2>
      {localPoll.options.map((opt: any, i: number) => (
        <button
          key={i}
          onClick={() => vote(i)}
          className="block border p-2 my-1 w-full text-left"
        >
          {opt.text} ({opt.votes})
        </button>
      ))}
    </div>
  );
}
