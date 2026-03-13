"use client";
import { useEffect, useState } from "react";

export default function PerformancePage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/attempt/performance")
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Performance</h1>
      <p>Total Attempts: {stats.totalAttempts}</p>
      <p>Average Score: {stats.avgScore?.toFixed(1)}%</p>
      <p>Best Score: {stats.bestScore}%</p>
    </div>
  );
}
