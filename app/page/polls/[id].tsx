import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import API from "../../../utils/api";

export default function PollPage() {
  const router = useRouter();
  const { id } = router.query;
  const [poll, setPoll] = useState<any>(null);

  useEffect(() => {
    if (id) {
      API.get(`/polls/${id}`).then((res) => setPoll(res.data));
    }
  }, [id]);

  const vote = async (index: number) => {
    try {
      await API.post(`/polls/${id}/vote`, { optionIndex: index });
      alert("Vote submitted!");
      const updated = await API.get(`/polls/${id}`);
      setPoll(updated.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Vote failed");
    }
  };

  if (!poll) return <p>Loading...</p>;

  return (
    <div>
      <h2>{poll.question}</h2>
      {poll.options.map((opt: any, i: number) => (
        <button key={i} onClick={() => vote(i)}>
          {opt.text} ({opt.votes})
        </button>
      ))}
    </div>
  );
}
