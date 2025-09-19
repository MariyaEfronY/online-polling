"use client";
import { useState } from "react";

// Types
interface PollOption {
  text: string;
  votes?: number;
}

interface Poll {
  _id?: string;
  question: string;
  options: PollOption[];
  createdBy?: string;
}

interface PollFormProps {
  onSubmit?: (poll: Poll) => void;
}

// API service functions
const API = {
  async createPoll(pollData: { question: string; options: PollOption[] }, token: string): Promise<Poll> {
    const response = await fetch("/api/polls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(pollData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create poll");
    }

    return response.json();
  },
};

// PollForm Component
export default function PollForm({ onSubmit }: PollFormProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pollId, setPollId] = useState<string | null>(null);

  // In a real app, this would come from your auth context or localStorage
  const getToken = (): string => {
    // Replace this with your actual token retrieval logic
    return localStorage.getItem("jwtToken") || "your-jwt-token-here";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate form
    if (!question.trim()) {
      setError("Please enter a poll question");
      setIsLoading(false);
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setError("Please enter at least two options");
      setIsLoading(false);
      return;
    }

    try {
      const token = getToken();
      const pollData = {
        question: question.trim(),
        options: validOptions.map(opt => ({ text: opt.trim() })),
      };

      const createdPoll = await API.createPoll(pollData, token);
      setPollId(createdPoll._id || null);
      setIsSubmitted(true);

      if (onSubmit) {
        onSubmit(createdPoll);
      }
    } catch (error: any) {
      console.error("Error creating poll", error);
      setError(error.message || "An error occurred while creating the poll");
    } finally {
      setIsLoading(false);
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setOptions(["", ""]);
    setIsSubmitted(false);
    setPollId(null);
    setError(null);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Poll Created Successfully!</h2>
        <p className="text-gray-600 mb-4">Your poll is now live and ready to share.</p>
        
        {pollId && (
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <p className="text-sm font-medium text-gray-700">Poll ID: {pollId}</p>
            <div className="mt-2 flex justify-center space-x-2">
              <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition">
                Copy Link
              </button>
              <button className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition">
                Share
              </button>
            </div>
          </div>
        )}
        
        <button
          onClick={resetForm}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition w-full"
        >
          Create Another Poll
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      <div className="mb-6">
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
          Poll Question
        </label>
        <input
          id="question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What's your favorite color?"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options
        </label>
        {options.map((opt, i) => (
          <div key={i} className="flex items-center mb-2">
            <input
              type="text"
              value={opt}
              onChange={(e) => {
                const newOpts = [...options];
                newOpts[i] = e.target.value;
                setOptions(newOpts);
              }}
              placeholder={`Option ${i + 1}`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="ml-2 p-2 text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        ))}
        
        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add option
          </button>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </>
        ) : "Create Poll"}
      </button>
    </form>
  );
}