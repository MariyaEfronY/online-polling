"use client";
import Link from "next/link";

export default function PollCard({ poll }: { poll: any }) {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold">{poll.question}</h2>
      <p className="text-gray-600">By {poll.createdBy?.username || "Unknown"}</p>
      <Link
        href={`/polls/${poll._id}`}
        className="text-blue-600 hover:underline mt-2 block"
      >
        View & Vote
      </Link>
    </div>
  );
}
