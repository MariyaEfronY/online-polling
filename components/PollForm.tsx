import { useState } from "react";
import API from "../utils/api";

export default function PollForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/polls", { question, options });
      alert("Poll created!");
    } catch (err) {
      console.error("Error creating poll", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Poll question"
      />
      {options.map((opt, i) => (
        <input
          key={i}
          value={opt}
          onChange={(e) => {
            const newOpts = [...options];
            newOpts[i] = e.target.value;
            setOptions(newOpts);
          }}
          placeholder={`Option ${i + 1}`}
        />
      ))}
      <button type="submit">Create Poll</button>
    </form>
  );
}
