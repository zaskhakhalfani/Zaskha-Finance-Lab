// app/learn/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const fallbackDashboardItems = [
  {
    id: "inflation",
    label: "UK inflation",
    value: "3.8%",
    change: "-0.2 pts vs prev",
    direction: "down",
    year: "latest",
  },
  {
    id: "base-rate",
    label: "Bank Rate (Bank of England)",
    value: "5.25%",
    change: "steady",
    direction: "flat",
    year: "current",
  },
  {
    id: "gdp",
    label: "GDP growth",
    value: "1.1%",
    change: "+0.1 pts vs prev",
    direction: "up",
    year: "latest",
  },
  {
    id: "unemployment",
    label: "Unemployment",
    value: "4.2%",
    change: "+0.1 pts vs prev",
    direction: "up",
    year: "latest",
  },
];

const topics = [
  {
    id: "inflation",
    title: "Inflation",
    tag: "Foundation",
    bullets: [
      "Prices of goods and services rise over time.",
      "If your money doesn't grow as fast, you can buy less with it.",
      "Keeping everything in cash can quietly make you poorer long term.",
    ],
    example:
      "£1,000 in cash with 5% inflation loses roughly £50 of purchasing power in a year if it earns no interest.",
    quiz: {
      question:
        "If inflation is 5% and your savings grow 1%, what happens to your purchasing power?",
      options: ["It goes up", "It stays the same", "It goes down"],
      answer: 2,
    },
  },
  {
    id: "interest-rates",
    title: "Interest rates",
    tag: "Foundation",
    bullets: [
      "They are the 'price of money' for borrowing and saving.",
      "Central banks raise them to cool inflation, cut them to boost the economy.",
      "Higher rates usually mean more expensive loans but better returns on savings.",
    ],
    example:
      "When rates go up, mortgage payments and credit card interest can rise, so debt becomes more costly.",
    quiz: {
      question:
        "When a central bank raises interest rates, what usually happens to borrowing?",
      options: [
        "Borrowing becomes cheaper",
        "Borrowing becomes more expensive",
        "Borrowing is unaffected",
      ],
      answer: 1,
    },
  },
  {
    id: "gdp",
    title: "GDP",
    tag: "Macro",
    bullets: [
      "GDP measures the total value of everything a country produces.",
      "Growing GDP usually means more jobs and income.",
      "Shrinking GDP can signal a recession and lower confidence.",
    ],
    example:
      "If GDP falls for two quarters in a row, news often calls it a recession – investors watch this closely.",
    quiz: {
      question: "What does GDP mainly measure?",
      options: [
        "The amount of money in people’s bank accounts",
        "The total value of goods and services a country produces",
        "The number of companies on the stock market",
      ],
      answer: 1,
    },
  },
  {
    id: "why-invest",
    title: "Why invest (not just save)",
    tag: "Your money",
    bullets: [
      "Saving is vital for emergencies and short-term needs.",
      "Inflation eats away at cash over many years.",
      "Investing aims to grow your money faster than inflation.",
    ],
    example:
      "If inflation averages 3% and your savings grow 1%, you lose about 2% of value each year in real terms.",
    quiz: {
      question: "Why do people invest instead of only keeping money in cash?",
      options: [
        "Because investing is always risk-free",
        "To try to grow their money faster than inflation",
        "So they can withdraw money any time without limits",
      ],
      answer: 1,
    },
  },
  {
    id: "risk-diversification",
    title: "Risk & diversification",
    tag: "Investing",
    bullets: [
      "Higher potential returns usually mean higher risk.",
      "Diversification = not putting all your money into one thing.",
      "Mixing assets (stocks, bonds, cash, etc.) can smooth the ups and downs.",
    ],
    example:
      "Putting everything into one meme coin is very risky. A broad mix of funds spreads that risk across many assets.",
    quiz: {
      question:
        "Which of these best describes diversification when investing?",
      options: [
        "Putting all your money into your favourite stock",
        "Spreading your money across different types of investments",
        "Keeping everything in cash",
      ],
      answer: 1,
    },
  },
];

const starterPrompts = [
  "Explain inflation like I'm 14 and show how it affects savings.",
  "Why do interest rate changes move stock and housing markets?",
  "How should a beginner think about risk when investing?",
  "What’s the difference between saving and investing?",
];

// MUCH longer macro timeline
const macroTimeline = [
  {
    year: "1700s",
    title: "Early Industrial Revolution",
    desc: "Factories, steam power and trade start transforming work, wages, and living standards in Britain.",
    tag: "Growth",
  },
  {
    year: "1816–1914",
    title: "Gold standard era",
    desc: "Many countries fix their currencies to gold, giving stable exchange rates but less flexibility.",
    tag: "Money system",
  },
  {
    year: "1840s–1870s",
    title: "Railways & global trade",
    desc: "Rail networks and steam ships slash transport times, boosting trade and new markets.",
    tag: "Globalisation",
  },
  {
    year: "1914–1918",
    title: "World War I",
    desc: "Huge government borrowing and disruption to trade change the global economic order.",
    tag: "Shock",
  },
  {
    year: "1920s",
    title: "Roaring Twenties",
    desc: "Rapid growth, new consumer goods and booming stock markets—followed by a crash.",
    tag: "Boom",
  },
  {
    year: "1929",
    title: "Wall Street Crash",
    desc: "US stock markets collapse, triggering bank failures and a global downturn.",
    tag: "Crash",
  },
  {
    year: "1930s",
    title: "Great Depression",
    desc: "World trade falls sharply, unemployment soars, and governments rethink economic policy.",
    tag: "Crisis",
  },
  {
    year: "1944",
    title: "Bretton Woods",
    desc: "New international rules link currencies to the US dollar and support post-war rebuilding.",
    tag: "System",
  },
  {
    year: "1950s–1960s",
    title: "Post-war boom",
    desc: "Fast growth, rising living standards, and expansion of welfare states in many countries.",
    tag: "Growth",
  },
  {
    year: "1970s",
    title: "Stagflation & oil shocks",
    desc: "High inflation mixed with weak growth and unemployment forces a shift in policy.",
    tag: "Inflation",
  },
  {
    year: "1980s",
    title: "Deregulation & Big Bang",
    desc: "Financial markets are liberalised, especially in London, boosting finance and credit.",
    tag: "Markets",
  },
  {
    year: "1990s",
    title: "Globalisation wave",
    desc: "Trade, supply chains and capital flows expand; emerging markets grow rapidly.",
    tag: "Globalisation",
  },
  {
    year: "1997",
    title: "BoE independence",
    desc: "The Bank of England gets control over interest rates with an official inflation target.",
    tag: "Policy",
  },
  {
    year: "2000",
    title: "Dot-com bubble",
    desc: "Tech stock boom and crash show how hype can disconnect from company profits.",
    tag: "Tech",
  },
  {
    year: "2001–2007",
    title: "Cheap credit era",
    desc: "Low interest rates and easy lending fuel housing booms and rising household debt.",
    tag: "Credit",
  },
  {
    year: "2008",
    title: "Global financial crisis",
    desc: "Housing and banking crisis leads to deep recession and massive government bailouts.",
    tag: "Crisis",
  },
  {
    year: "2010s",
    title: "Ultra-low rates & QE",
    desc: "Central banks keep interest rates near zero and buy bonds to support weak economies.",
    tag: "Rates",
  },
  {
    year: "2016",
    title: "Brexit vote",
    desc: "The UK votes to leave the EU, creating years of uncertainty for trade and investment.",
    tag: "Policy shock",
  },
  {
    year: "2020",
    title: "Covid shock",
    desc: "Lockdowns hit jobs and output; governments spend heavily to support workers and firms.",
    tag: "Shock",
  },
  {
    year: "2021–22",
    title: "Inflation returns",
    desc: "Supply bottlenecks and strong demand push inflation to multi-decade highs.",
    tag: "Inflation",
  },
  {
    year: "Today",
    title: "Higher rates & new trends",
    desc: "Central banks juggle inflation with growth while AI, ageing and climate policy reshape economies.",
    tag: "Now",
  },
];

// ---------- Mini illustrations ----------

function TopicIllustration({ topicId }) {
  return (
    <svg
      viewBox="0 0 120 80"
      className="w-28 h-16 sm:w-32 sm:h-20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="learnGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>

      <circle cx="60" cy="40" r="32" fill="url(#learnGrad)" opacity="0.18" />

      {topicId === "inflation" && (
        <>
          <circle
            cx="35"
            cy="46"
            r="12"
            stroke="url(#learnGrad)"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="60"
            cy="40"
            r="9"
            stroke="url(#learnGrad)"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
          <circle
            cx="82"
            cy="34"
            r="6"
            stroke="url(#learnGrad)"
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M30 25 L90 20"
            stroke="#22c55e"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.4"
          />
        </>
      )}

      {topicId === "interest-rates" && (
        <>
          <path
            d="M25 55 L25 25 L90 25"
            stroke="#0f172a"
            strokeWidth="2"
            opacity="0.4"
          />
          <path
            d="M30 50 L50 45 L70 35 L88 28"
            stroke="url(#learnGrad)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <polygon points="86,24 92,26 88,32" fill="#22c55e" opacity="0.9" />
        </>
      )}

      {topicId === "gdp" && (
        <>
          <rect
            x="30"
            y="40"
            width="10"
            height="18"
            rx="2"
            fill="#0f172a"
            stroke="url(#learnGrad)"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <rect
            x="48"
            y="32"
            width="10"
            height="26"
            rx="2"
            fill="#0f172a"
            stroke="url(#learnGrad)"
            strokeWidth="1.5"
          />
          <rect
            x="66"
            y="26"
            width="10"
            height="32"
            rx="2"
            fill="#0f172a"
            stroke="url(#learnGrad)"
            strokeWidth="1.5"
          />
          <rect
            x="84"
            y="20"
            width="10"
            height="38"
            rx="2"
            fill="#0f172a"
            stroke="url(#learnGrad)"
            strokeWidth="1.5"
            opacity="0.9"
          />
        </>
      )}

      {topicId === "why-invest" && (
        <>
          <path
            d="M20 55 L95 45"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <path
            d="M20 55 C40 52, 55 45, 80 30 L95 22"
            stroke="url(#learnGrad)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}

      {topicId === "risk-diversification" && (
        <>
          <circle cx="40" cy="52" r="3" fill="#22c55e" />
          <circle cx="55" cy="38" r="3" fill="#22c55e" />
          <circle cx="70" cy="50" r="3" fill="#22c55e" />
          <circle cx="82" cy="32" r="3" fill="#22c55e" />
          <circle cx="50" cy="26" r="3" fill="#38bdf8" />
          <rect
            x="32"
            y="20"
            width="56"
            height="36"
            rx="10"
            stroke="url(#learnGrad)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
        </>
      )}
    </svg>
  );
}

// Plain-English explanation under each dashboard tile
function getDashboardExplanation(item) {
  switch (item.id) {
    case "inflation":
      return "Shows how fast prices are rising across the whole economy. Higher inflation means your cash loses value faster if it isn’t growing.";
    case "gdp":
      return "Shows how quickly the size of the UK economy is growing or shrinking. Negative numbers can signal recession risk.";
    case "unemployment":
      return "Roughly what share of people who want a job can’t find one. Higher unemployment usually means more financial stress for households.";
    case "base-rate":
      return "The main interest rate set by the Bank of England. It influences mortgages, loans and savings rates across the country.";
    default:
      return "Headline macro number – useful background for your personal money decisions.";
  }
}

// ---------- PAGE COMPONENT ----------

export default function LearnPage() {
  const [selectedTopicId, setSelectedTopicId] = useState("inflation");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to the AI Economics Tutor. Pick a topic on the left or ask any question about economics, investing, or personal finance.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [timelineItem, setTimelineItem] = useState(null);
  const [timelineOpen, setTimelineOpen] = useState(false);

  // mini-dashboard state (live + fallback)
  const [dashboardItems, setDashboardItems] = useState(
    fallbackDashboardItems
  );
  const [dashboardError, setDashboardError] = useState(null);

  const selectedTopic =
    topics.find((t) => t.id === selectedTopicId) ?? topics[0];

  // Fetch real macro data from /api/mini-dashboard and MERGE with fallback
  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const res = await fetch("/api/mini-dashboard", { cache: "no-store" });
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        if (!data || !Array.isArray(data.items)) return;
        if (cancelled) return;

        const merged = fallbackDashboardItems.map((fallback) => {
          const live = data.items.find((i) => i.id === fallback.id);
          return live
            ? {
                ...fallback,
                value: live.value ?? fallback.value,
                change: live.change ?? fallback.change,
                direction: live.direction ?? fallback.direction,
                year: live.year ?? fallback.year,
              }
            : fallback;
        });

        setDashboardItems(merged);
        setDashboardError(null);
      } catch (err) {
        console.error("Mini dashboard fetch failed:", err);
        if (!cancelled) {
          setDashboardError("Using demo numbers (API unavailable).");
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setQuizSelection(null);
    setQuizResult(null);
  }, [selectedTopicId]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Error from tutor backend: " + String(data.error),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't reach the tutor service right now. Check your internet or try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function askAboutTopic(topic) {
    const prompt = `Explain ${topic.title} and why it matters for my money in simple terms.`;
    setInput(prompt);
  }

  function handleQuizClick(idx) {
    if (!selectedTopic.quiz) return;
    setQuizSelection(idx);
    if (idx === selectedTopic.quiz.answer) {
      setQuizResult("correct");
    } else {
      setQuizResult("incorrect");
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
            Learn
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold text-slate-50">
            Build your economics foundation.
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
            Start with the core ideas, then use the AI tutor to connect them to
            your own income, savings, and investing decisions.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-[11px] text-slate-300">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Interactive lessons · Education only
        </div>
      </header>

      {/* Mini macro dashboard */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950/90 via-slate-950/80 to-slate-900/80 px-3 py-3 text-[11px] sm:text-xs shadow-[0_0_45px_rgba(15,23,42,0.8)]"
          >
            <p className="text-[10px] text-slate-400 mb-1">
              {item.label}
              {item.year && item.year !== "latest" && item.year !== "current"
                ? ` (${item.year})`
                : ""}
            </p>
            <div className="flex items-baseline justify-between">
              <p className="text-sm sm:text-base font-semibold text-slate-50">
                {item.value}
              </p>
              <div className="flex items-center gap-1 text-[10px]">
                {item.direction === "up" && (
                  <span className="text-emerald-400">▲</span>
                )}
                {item.direction === "down" && (
                  <span className="text-rose-400">▼</span>
                )}
                {item.direction === "flat" && (
                  <span className="text-slate-400">●</span>
                )}
                <span
                  className={
                    item.direction === "up"
                      ? "text-emerald-300"
                      : item.direction === "down"
                      ? "text-rose-300"
                      : "text-slate-400"
                  }
                >
                  {item.change}
                </span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              {getDashboardExplanation(item)}{" "}
              {item.id !== "base-rate" && "Source: World Bank (annual data)."}
            </p>
          </div>
        ))}
      </section>
      {dashboardError && (
        <p className="text-[10px] text-amber-300">{dashboardError}</p>
      )}

      {/* Main grid: concepts + tutor */}
      <div className="grid gap-6 lg:grid-cols-[1.05fr,1.2fr]">
        {/* LEFT: concepts */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 text-xs sm:text-sm space-y-4 shadow-[0_0_80px_rgba(15,23,42,0.9)]">
          <header className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-50">
                Learn the basics
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
                Tap a topic to see a one-minute breakdown. Then ask the tutor on
                the right to personalise it to your situation.
              </p>
            </div>
            <span className="hidden sm:inline rounded-full bg-slate-800 px-3 py-1 text-[10px] text-slate-300">
              Step 1 · Concepts
            </span>
          </header>

          {/* Topic pills */}
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopicId(topic.id)}
                className={
                  "px-3 py-1.5 rounded-full text-[11px] sm:text-xs border transition " +
                  (topic.id === selectedTopicId
                    ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.55)]"
                    : "bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700 hover:border-slate-500")
                }
              >
                {topic.title}
              </button>
            ))}
          </div>

          {/* Selected topic card + illustration */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-slate-900/70 p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-50">
                  {selectedTopic.title}
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Big picture first, maths later.
                </p>
              </div>
              {selectedTopic.tag && (
                <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] text-slate-300 border border-slate-700">
                  {selectedTopic.tag}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
              <div className="flex-1">
                <ul className="list-disc list-inside text-[11px] sm:text-xs text-slate-200 space-y-1.5">
                  {selectedTopic.bullets.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 sm:mt-0 sm:flex-none flex justify-center">
                <TopicIllustration topicId={selectedTopic.id} />
              </div>
            </div>

            <div className="mt-1 rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-[11px] text-slate-300">
              <span className="font-semibold text-slate-100">
                Simple example:{" "}
              </span>
              {selectedTopic.example}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => askAboutTopic(selectedTopic)}
                className="mt-1 inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-semibold hover:bg-emerald-400"
              >
                Ask the tutor about this →
              </button>

              {selectedTopic.id === "inflation" && (
                <Link
                  href="/portfolio?inflation=5"
                  className="mt-1 inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-slate-900 text-slate-100 text-[11px] border border-slate-700 hover:bg-slate-800"
                >
                  Try 5% inflation in the portfolio simulator →
                </Link>
              )}
            </div>

            {/* Quick quiz */}
            {selectedTopic.quiz && (
              <div className="mt-3 rounded-xl bg-slate-900/90 border border-slate-800 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-slate-100">
                  Quick check
                </p>
                <p className="text-[11px] text-slate-300">
                  {selectedTopic.quiz.question}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {selectedTopic.quiz.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuizClick(idx)}
                      className={
                        "px-2.5 py-1 rounded-full text-[11px] border transition " +
                        (quizSelection === idx
                          ? idx === selectedTopic.quiz.answer
                            ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.55)]"
                            : "bg-rose-500 text-slate-950 border-rose-500"
                          : "bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700")
                      }
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizResult && (
                  <p
                    className={
                      "text-[11px] mt-1 " +
                      (quizResult === "correct"
                        ? "text-emerald-300"
                        : "text-rose-300")
                    }
                  >
                    {quizResult === "correct"
                      ? "Nice! That's correct."
                      : `Not quite. The correct answer is: "${
                          selectedTopic.quiz.options[
                            selectedTopic.quiz.answer
                          ]
                        }".`}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT: AI tutor */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 flex flex-col min-h-[480px] shadow-[0_0_80px_rgba(15,23,42,0.9)]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm sm:text-base font-semibold text-slate-50">
              AI Economics Tutor
            </h2>
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[10px] text-slate-300 border border-slate-700">
              Step 2 · Ask & explore
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 mb-3">
            Ask anything about inflation, interest rates, GDP, investing, or
            personal finance. Answers are for education only – not personal
            financial advice.
          </p>

          <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/50 p-3 space-y-3 text-xs backdrop-blur-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  "max-w-[90%] px-3 py-2 rounded-2xl whitespace-pre-wrap leading-relaxed " +
                  (m.role === "user"
                    ? "ml-auto bg-emerald-500 text-slate-950"
                    : "bg-slate-800 text-slate-50")
                }
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="inline-flex items-center gap-2 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
                Thinking…
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded-full bg-slate-950 border border-slate-700 px-3 py-2 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/60"
              placeholder="e.g. How does inflation affect my savings over 10 years?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-full bg-emerald-500 text-slate-950 text-xs font-semibold hover:bg-emerald-400 disabled:opacity-60"
            >
              Send
            </button>
          </form>

          <div className="mt-3 flex flex-wrap gap-2">
            {starterPrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setInput(p)}
                className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-100 text-[11px] hover:bg-slate-700"
              >
                {p}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Extended macro timeline */}
      <section className="mt-2 rounded-3xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-50">
              The economy over time
            </h2>
            <p className="mt-1 text-[11px] sm:text-xs text-slate-300 max-w-2xl">
              Big events shape interest rates, inflation, jobs and markets. Drag
              across this mini-timeline to see how 300+ years of history feed
              into today&apos;s economy.
            </p>
          </div>
          <span className="hidden sm:inline rounded-full bg-slate-800/80 px-3 py-1 text-[10px] text-slate-300 border border-slate-700">
            Step 3 · Context
          </span>
        </div>

        <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
          {macroTimeline.map((item) => (
            <button
              type="button"
              key={item.year}
              onClick={() => {
                setTimelineItem(item);
                setTimelineOpen(true);
              }}
              className="min-w-[190px] max-w-[220px] rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950/80 to-slate-900/80 p-3 text-[11px] sm:text-xs hover:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <p className="text-[10px] text-emerald-400 font-semibold">
                {item.year}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-slate-50">
                {item.title}
              </p>
              <p className="mt-1 text-[11px] text-slate-300">{item.desc}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-[10px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {item.tag}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Timeline modal */}
      {timelineOpen && timelineItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950 p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                  {timelineItem.year} · {timelineItem.tag}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-slate-100">
                  {timelineItem.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  {timelineItem.desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTimelineOpen(false)}
                className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-100 hover:bg-slate-800"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                Why it matters
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Use this event to connect <span className="text-slate-100 font-semibold">context → mechanism → impact</span>.
                Start by stating what happened, explain the economic mechanism (inflation, rates, jobs, confidence, policy),
                and finish with the implication for households, firms, or markets.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/inflation"
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Explore inflation →
              </Link>
              <Link
                href="/portfolio"
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800"
              >
                Portfolio simulator →
              </Link>
              <button
                type="button"
                onClick={() => setTimelineOpen(false)}
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800"
              >
                Back to timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
