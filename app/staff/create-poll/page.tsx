// app/staff/create-poll/page.tsx
"use client";
import { useState } from "react";
import API from "@/utils/api";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/clientAuth";

export default function CreatePollPage() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correct, setCorrect] = useState<number | null>(null);
  const router = useRouter();

  if (!getToken()) { return <p>Please login as staff</p>; }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await API.post("/polls", { question, options, correctOption: correct });
      alert("Created");
      router.push("/");
    } catch (err:any) { alert(err.response?.data?.message || "Error"); }
  }

  return (
    <form onSubmit={submit}>
      <input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Question" />
      {options.map((o,i)=>(
        <div key={i}>
          <input value={o} onChange={e => { const a=[...options]; a[i]=e.target.value; setOptions(a);} } />
          <label>
            <input type="radio" checked={correct===i} onChange={()=>setCorrect(i)} /> correct
          </label>
        </div>
      ))}
      <button type="button" onClick={()=>setOptions([...options,""])}>Add option</button>
      <button type="submit">Create</button>
    </form>
  );
}
