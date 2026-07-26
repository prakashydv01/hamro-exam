"use client";

import { useEffect, useState } from "react";
import StatCard from "@/app/Components/statsCard";

type OverviewStats = {
  totalAttempts: number;
  averageScore: string | number;
  bestScore: number;
  weakSubject: string;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/overview")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading overview...</p>;
  }

  if (!stats) {
    return <p className="text-red-500">Failed to load overview</p>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Attempts" value={stats.totalAttempts} />
        <StatCard title="Average Score" value={stats.averageScore} />
        <StatCard title="Best Score" value={stats.bestScore} />
        <StatCard title="Weak Subject" value={stats.weakSubject} />
      </div>
    </>
  );
}
