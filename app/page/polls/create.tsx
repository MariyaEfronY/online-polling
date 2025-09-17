import { useState } from "react";
import API from "../../../utils/api";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/polls", { question, options: options.map((text) => ({ text })) });
      alert("Poll created!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Poll creation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
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
        />
      ))}
      <button type="submit">Create Poll</button>
    </form>
  );
}
