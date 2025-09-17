"use client";
import { useEffect, useState } from "react";
import API from "../utils/api";

export default function PollForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Load token after client mount
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) {
        alert("You must login first!");
        return;
      }

      await API.post("/polls", {
        question,
        options: options.map((text) => ({ text })),
      });

      alert("Poll created!");
      setQuestion("");
      setOptions(["", ""]);
    } catch (err: any) {
      alert(err.response?.data?.message || "Poll creation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2"
      />
      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => {
            const newOpts = [...options];
            newOpts[i] = e.target.value;
            setOptions(newOpts);
          }}
          className="border p-2"
        />
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Create Poll
      </button>
    </form>
  );
}
