import { useState } from "react";
import API from "../utils/api";

export default function PollForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await API.post("/polls", {
      question,
      options: options.map((o) => ({ text: o })),
    });
    console.log("Poll created:", res.data);
  } catch (error) {
    console.error("Error creating poll", error);
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
