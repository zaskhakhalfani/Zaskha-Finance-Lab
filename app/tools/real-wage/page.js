// app/tools/real-wage/page.js
"use client";

import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const DEFAULT_ENTRIES = [
  { id: 1, label: "2021", salary: 24000 },
  { id: 2, label: "2022", salary: 26000 },
  { id: 3, label: "2023", salary: 28000 },
  { id: 4, label: "2024", salary: 30000 },
];

function formatMoney(value) {
  if (!isFinite(value)) return "£0";
  return (
    "£" +
    value
      .toFixed(0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}

export default function RealWagesPage() {
  const [entries, setEntries] = useState(DEFAULT_ENTRIES);
  const [inflationRate, setInflationRate] = useState(4); // assume constant % p.a.

  const addRow = () => {
    const nextId = entries.length ? Math.max(...entries.map((e) => e.id)) + 1 : 1;
    setEntries([
      ...entries,
      { id: nextId, label: `Year ${entries.length + 1}`, salary: 25000 },
    ]);
  };

  const updateEntry = (id, field, value) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              [field]:
                field === "label" ? value : Math.max(0, Number(value) || 0),
            }
          : e
      )
    );
  };

  const removeEntry = (id) => {
    if (entries.length <= 2) return; // keep at least 2 points
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const data = useMemo(() => {
    const pi = (Number(inflationRate) || 0) / 100;
    const n = entries.length;
    if (!n) return [];

    // Treat last entry as "today" and express all salaries in today's prices
    return entries.map((e, idx) => {
      const yearsFromStart = idx; // assume sequential years
      const yearsToToday = n - 1 - idx;
      const nominal = Number(e.salary) || 0;
      const realToday = nominal * Math.pow(1 + pi, yearsToToday);
      return {
        label: e.label || `Year ${yearsFromStart + 1}`,
        nominal,
        real: realToday,
        realIndex: realToday / (Number(entries[0].salary) || 1),
      };
    });
  }, [entries, inflationRate]);

  const latest = data[data.length - 1];
  const oldest = data[0];

  const realChangePct =
    latest && oldest ? ((latest.real / oldest.real - 1) || 0) * 100 : 0;
  const nominalChangePct =
    latest && oldest ? ((latest.nominal / oldest.nominal - 1) || 0) * 100 : 0;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Real wages checker
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Enter your pay over several years and a rough inflation rate. The
          chart shows how your salary looks after adjusting for rising prices –
          your <span className="font-semibold">real wage</span>.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.05fr,1.1fr]">
        {/* LEFT: table + inputs */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs sm:text-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-50">
              Your salary history
            </h2>
            <button
              type="button"
              onClick={addRow}
              className="text-[11px] px-2 py-1 rounded-full border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition"
            >
              + Add year
            </button>
          </div>

          <div className="overflow-x-auto -mx-2">
            <table className="min-w-full text-[11px] border-separate border-spacing-y-1 px-2">
              <thead className="text-slate-400">
                <tr>
                  <th className="text-left px-2 py-1">Year / label</th>
                  <th className="text-right px-2 py-1">Salary (gross, £)</th>
                  <th className="px-2 py-1" />
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr
                    key={e.id}
                    className="bg-slate-950/60 border border-slate-800"
                  >
                    <td className="px-2 py-1.5">
                      <input
                        type="text"
                        value={e.label}
                        onChange={(ev) =>
                          updateEntry(e.id, "label", ev.target.value)
                        }
                        className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-[11px] outline-none focus:border-emerald-400"
                      />
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      <input
                        type="number"
                        min={0}
                        value={e.salary}
                        onChange={(ev) =>
                          updateEntry(e.id, "salary", ev.target.value)
                        }
                        className="w-full rounded-md bg-slate-900 border border-slate-700 px-1.5 py-1 text-right text-[11px] outline-none focus:border-emerald-400"
                      />
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      <button
                        type="button"
                        onClick={() => removeEntry(e.id)}
                        className="text-[10px] text-slate-500 hover:text-rose-400"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-[11px]">
            <div className="space-y-1 sm:col-span-1">
              <label className="block text-slate-300">
                Average inflation rate (% per year)
              </label>
              <input
                type="number"
                min={0}
                max={30}
                step={0.1}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full rounded-md bg-slate-950 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-emerald-400"
              />
              <p className="text-[10px] text-slate-400">
                You can use average CPI for your country, or just a rough guess
                (e.g. 3–5%).
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-300">Change in nominal pay</p>
              <p className="text-sm font-semibold text-slate-50">
                {nominalChangePct >= 0 ? "+" : ""}
                {nominalChangePct.toFixed(1)}%
              </p>
              <p className="text-[10px] text-slate-400">
                Just looking at the salary number on your payslip.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-300">Change in real pay</p>
              <p
                className={`text-sm font-semibold ${
                  realChangePct >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {realChangePct >= 0 ? "+" : ""}
                {realChangePct.toFixed(1)}%
              </p>
              <p className="text-[10px] text-slate-400">
                After inflation, expressed in today&apos;s prices.
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT: chart */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs sm:text-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-50">
            Nominal vs real salary
          </h2>
          <p className="text-[11px] text-slate-300">
            The teal line is your salary number each year. The green line adjusts
            for inflation and shows what those salaries are worth in today’s
            money.
          </p>

          <div className="mt-2 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickMargin={4}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value, key) =>
                    key === "realIndex"
                      ? [(Number(value) || 0).toFixed(2), "Real index"]
                      : formatMoney(typeof value === "number" ? value : 0)
                  }
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#1e293b",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 10 }}
                  iconSize={8}
                  verticalAlign="top"
                  height={24}
                />
                <Line
                  type="monotone"
                  dataKey="nominal"
                  name="Nominal salary"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="real"
                  name="Real salary (today’s prices)"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-slate-300 space-y-1.5">
            <p className="font-semibold text-slate-100">How to read this</p>
            <p>
              If the green line sits below the blue line and grows more slowly,
              your pay hasn&apos;t fully kept up with rising prices. If it
              climbs faster, your real purchasing power is improving.
            </p>
            <p className="text-[10px] text-slate-500">
              This is a simplified model (constant inflation etc.). It&apos;s a
              learning tool, not personalised financial advice.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
