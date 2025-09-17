import { useEffect, useState } from "react";
import API from "../../../utils/api";

export default function Polls() {
  const [polls, setPolls] = useState<any[]>([]);

  useEffect(() => {
    API.get("/polls").then((res) => setPolls(res.data));
  }, []);

  return (
    <div>
      <h1>All Polls</h1>
      {polls.map((poll) => (
        <div key={poll._id}>
          <h3>{poll.question}</h3>
          <a href={`/polls/${poll._id}`}>View</a>
        </div>
      ))}
    </div>
  );
}
