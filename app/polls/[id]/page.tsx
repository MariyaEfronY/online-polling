"use client";

import { useEffect, useState } from "react";
import API from "../../../utils/api";
import PollDetail from "../../../components/PollDetail";

interface PollPageProps {
  params: { id: string };
}

export default function PollDetailPage({ params }: PollPageProps) {
  const { id } = params;
  const [poll, setPoll] = useState<any>(null);

  useEffect(() => {
    if (id) {
      API.get(`/polls/${id}`)
        .then((res) => setPoll(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  return poll ? <PollDetail poll={poll} /> : <p>Loading...</p>;
}
