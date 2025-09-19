"use client";
import PollForm from "../../../components/PollForm";

export default function CreatePollPage() {
  const handlePollCreated = (poll: any) => {
    console.log("Poll created:", poll);
    // You can add additional logic here after a poll is created
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Poll</h1>
          <p className="text-gray-600">Create and share polls with your audience</p>
        </div>
        <PollForm onSubmit={handlePollCreated} />
      </div>
    </div>
  );
}