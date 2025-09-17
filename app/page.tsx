import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-light text-white py-20 text-center rounded-2xl shadow-lg">
      <h1 className="text-5xl font-bold">Online Polling</h1>
      <p className="mt-4 text-lg">Create, share, and vote on polls instantly.</p>
      <div className="mt-6 space-x-4">
        <Link href="/polls/create">
          <button className="bg-secondary px-6 py-3 rounded-lg hover:bg-secondary-light">
            Create Poll
          </button>
        </Link>
        <Link href="/polls">
          <button className="bg-white text-primary px-6 py-3 rounded-lg hover:bg-gray-200">
            View Polls
          </button>
        </Link>
      </div>
    </div>
  );
}
