"use client";
import { useState } from "react";
import API from "../utils/api";

export default function PollDetail({ poll }: { poll: any }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [data, setData] = useState(poll);

  const handleVote = async () => {
    if (selected === null) return;
    try {
      const res = await API.post(`/polls/${data._id}/vote`, {
        optionIndex: selected,
      });
      setData(res.data.poll || res.data);
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{data.question}</h1>
      <ul className="space-y-2">
        {data.options.map((opt: any, i: number) => (
          <li key={i}>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="vote"
                onChange={() => setSelected(i)}
              />
              {opt.text} ({opt.votes} votes)
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleVote}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Submit Vote
      </button>
    </div>
  );
}
