// components/PollCard.tsx
import Link from "next/link";

export default function PollCard({ poll }: { poll: any }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold">{poll.question}</h3>
      <p className="text-sm text-gray-500 mt-2">{poll.options?.length} options</p>
      <div className="mt-3">
        <Link href={`/polls/${poll._id}`} className="text-indigo-600">Take test</Link>
      </div>
    </div>
  );
}
