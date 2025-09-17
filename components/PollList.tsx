"use client";
import Link from "next/link";

export default function PollList({ polls }: { polls: any[] }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Polls</h1>
      <ul className="space-y-2">
        {polls.map((poll) => (
          <li key={poll._id} className="border p-2">
            <Link href={`/polls/${poll._id}`}>{poll.question}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
