"use client";
import { useEffect, useState } from "react";
import API from "../../utils/api";
import { getToken } from "../../lib/auth";

interface Poll {
  _id: string;
  question: string;
  options: Array<{
    text: string;
    votes: number;
    _id?: string;
  }>;
  createdBy?: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt?: string;
  totalVotes?: number;
}

export default function DashboardPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      window.location.href = "/login";
      return;
    }

    const fetchPolls = async () => {
      try {
        setIsLoading(true);
        const res = await API.get("/polls");
        
        // Show only user's polls
        const myId = JSON.parse(atob(getToken()!.split(".")[1])).id;
        const myPolls = res.data.filter(
          (poll: Poll) => poll.createdBy?._id === myId
        );
        
        // Calculate total votes for each poll
        const pollsWithVotes = myPolls.map((poll: Poll) => ({
          ...poll,
          totalVotes: poll.options.reduce((sum, option) => sum + option.votes, 0)
        }));
        
        setPolls(pollsWithVotes);
      } catch (err: any) {
        console.error("Failed to fetch polls:", err);
        setError(err.response?.data?.message || "Failed to load polls");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeletePoll = async (pollId: string) => {
    if (!confirm("Are you sure you want to delete this poll? This action cannot be undone.")) {
      return;
    }

    try {
      await API.delete(`/polls/${pollId}`);
      setPolls(polls.filter(poll => poll._id !== pollId));
    } catch (err: any) {
      console.error("Failed to delete poll:", err);
      alert("Failed to delete poll. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Polls</h1>
            <p className="text-gray-600 mt-2">Manage and track your created polls</p>
          </div>
          <a
            href="/polls/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create New Poll
          </a>
        </div>

        {polls.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No polls yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first poll.</p>
            <div className="mt-6">
              <a
                href="/polls/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Your First Poll
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <div key={poll._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{poll.question}</h3>
                    <button
                      onClick={() => handleDeletePoll(poll._id)}
                      className="text-gray-400 hover:text-red-500 transition"
                      aria-label="Delete poll"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    {poll.options.slice(0, 3).map((option, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full" 
                            style={{ width: `${poll.totalVotes ? (option.votes / poll.totalVotes) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 w-8">{option.votes}</span>
                      </div>
                    ))}
                    {poll.options.length > 3 && (
                      <p className="text-sm text-gray-500">+{poll.options.length - 3} more options</p>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''}
                    </span>
                    {poll.createdAt && (
                      <span className="text-sm text-gray-500">
                        {formatDate(poll.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                  <a
                    href={`/polls/${poll._id}`}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    View results
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    href={`/polls/${poll._id}/vote`}
                    className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                  >
                    Share poll
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}