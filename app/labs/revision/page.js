// app/labs/revision/page.js
"use client";

import { useState } from "react";
import Link from "next/link";

const levels = ["Beginner", "Intermediate", "Exam-style"];

export default function RevisionLab() {
  const [level, setLevel] = useState(levels[0]);
  const [topic, setTopic] = useState("Inflation");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateQuestion() {
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a rigorous but friendly economics tutor and examiner. Generate exam-style questions and mark answers strictly using clear criteria. Be concise." },
            { role: "user", content: `Generate one ${level} question on the topic: ${topic}. Provide ONLY the question (no answer).` },
          ],
        }),
      });
      const data = await res.json();
      setQuestion(data?.answer || "No question generated.");
    } catch (e) {
      setQuestion("Error generating question.");
    } finally {
      setLoading(false);
    }
  }

  async function markAnswer() {
    if (!question.trim() || !answer.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a strict examiner. Mark the student's answer against a clear marking scheme. Output: (1) Mark /10, (2) Bullet feedback, (3) Improved model answer, (4) One next step." },
            { role: "user", content: `Topic: ${topic}
Level: ${level}

Question:
${question}

Student answer:
${answer}` },
          ],
        }),
      });
      const data = await res.json();
      setFeedback(data?.answer || "No feedback returned.");
    } catch (e) {
      setFeedback("Error marking answer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-3 py-8 sm:px-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100">Revision & Practice Lab</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Turn concepts into practice. Generate questions, answer them, and get structured feedback.
          </p>
        </div>
        <Link href="/learn" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800">
          Go to Learn →
        </Link>
      </div>

      <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          >
            {levels.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full sm:w-72 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            placeholder="Topic (e.g., Inflation, AD/AS, Elasticity)"
          />

          <button
            onClick={generateQuestion}
            disabled={loading}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Working…" : "Generate question"}
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Question</p>
            <div className="mt-2 whitespace-pre-wrap text-sm text-slate-100 min-h-[120px]">
              {question || "Generate a question to begin."}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Your answer</p>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="mt-2 w-full min-h-[120px] rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              placeholder="Write your answer here…"
            />
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={markAnswer}
                disabled={loading || !question.trim() || !answer.trim()}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800 disabled:opacity-60"
              >
                {loading ? "Marking…" : "Mark my answer"}
              </button>
              <p className="text-xs text-slate-400">
                Educational feedback only — no personal financial advice.
              </p>
            </div>
          </div>
        </div>

        {feedback && (
          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Feedback</p>
            <div className="mt-2 whitespace-pre-wrap text-sm text-slate-100">{feedback}</div>
          </div>
        )}
      </section>
    </main>
  );
}
