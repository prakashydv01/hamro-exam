"use client";

import { useEffect, useState } from "react";

type Question = {
  _id: string;
  question: string;
  faculty: string;
  subject: string;
};

export default function DeleteQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [faculty, setFaculty] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchQuestions = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin?type=questions&page=1`);
    const data = await res.json();

    let filtered = data.data;

    if (faculty) {
      filtered = filtered.filter((q: Question) => q.faculty === faculty);
    }

    if (subject) {
      filtered = filtered.filter((q: Question) => q.subject === subject);
    }

    setQuestions(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  /* ================= SELECT ================= */
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  /* ================= DELETE SELECTED ================= */
  const deleteSelected = async () => {
    if (!selected.length) return alert("No questions selected");

    await fetch("/api/admin", {
      method: "DELETE",
      body: JSON.stringify({ ids: selected }),
    });

    alert("Deleted selected questions");
    setSelected([]);
    fetchQuestions();
  };

  /* ================= DELETE BY FILTER ================= */
  const deleteByFilter = async () => {
    if (!faculty || !subject) {
      return alert("Select faculty & subject");
    }

    await fetch("/api/admin", {
      method: "DELETE",
      body: JSON.stringify({ faculty, subject }),
    });

    alert("Deleted all filtered questions");
    fetchQuestions();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Delete Questions</h1>

      {/* FILTER */}
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Faculty"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          className="border p-2"
        />

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border p-2"
        />

        <button
          onClick={fetchQuestions}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Filter
        </button>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={deleteSelected}
          className="bg-red-500 text-white px-4 py-2"
        >
          Delete Selected
        </button>

        <button
          onClick={deleteByFilter}
          className="bg-black text-white px-4 py-2"
        >
          Delete by Faculty + Subject
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {questions.map((q) => (
            <div
              key={q._id}
              className="border p-3 flex items-center gap-3"
            >
              <input
                type="checkbox"
                checked={selected.includes(q._id)}
                onChange={() => toggleSelect(q._id)}
              />

              <div>
                <p className="font-medium">{q.question}</p>
                <p className="text-sm text-gray-500">
                  {q.faculty} | {q.subject}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}