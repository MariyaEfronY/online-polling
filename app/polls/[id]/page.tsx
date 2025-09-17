"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "../../../utils/api";
import PollDetail from "../../../components/PollDetail";

export default function PollDetailPage() {
  const params = useParams();
  const id = params?.id as string;   // ✅ Explicit cast
  const [poll, setPoll] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    API.get(`/polls/${id}`)
      .then((res) => setPoll(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  return poll ? <PollDetail poll={poll} /> : <p>Loading...</p>;
}
