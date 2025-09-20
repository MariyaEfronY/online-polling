// app/polls/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "@/utils/api";
import { useRouter } from "next/navigation";

export default function PollDetailPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState<any>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    API.get(`/polls/${id}`).then(r => setPoll(r.data)).catch(console.error);
  }, [id]);

  async function submit() {
    if (selected === null) { alert("Choose an option"); return; }
    try {
      const res = await API.post(`/polls/${id}/submit`, { optionIndex: selected });
      alert(res.data.isCorrect ? "Correct!" : "Submitted");
      router.push("/student/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Submit failed");
    }
  }

  if (!poll) return <p>Loading...</p>;
  return (
    <div>
      <h2 className="text-xl font-bold">{poll.question}</h2>
      <div className="mt-4 space-y-2">
        {poll.options.map((opt: any, i: number) => (
          <label key={i} className="block">
            <input type="radio" checked={selected === i} onChange={()=>setSelected(i)} />
            <span className="ml-2">{opt.text}</span>
          </label>
        ))}
      </div>
      <button onClick={submit} className="mt-4">Submit</button>
    </div>
  );
}
