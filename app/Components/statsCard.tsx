// app/Components/statsCard.tsx
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}