"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/attempt")
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Test History</h1>

      {data.length === 0 && <p>No attempts found</p>}

      {data.map(attempt => (
        <div
          key={attempt._id}
          className="bg-white p-4 mb-3 rounded shadow"
        >
          <p><b>Exam:</b> {attempt.exam}</p>
          <p><b>Mode:</b> {attempt.mode}</p>
          <p><b>Score:</b> {attempt.score}%</p>
          <p>
            <b>Date:</b>{" "}
            {new Date(attempt.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
