// app/tools/cost-of-delay/page.js
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

export default function CostOfDelayPage() {
  const [monthly, setMonthly] = useState(200);
  const [yearsTotal, setYearsTotal] = useState(30);
  const [delayYears, setDelayYears] = useState(5);
  const [annualReturn, setAnnualReturn] = useState(7);

  const data = useMemo(() => {
    const total = Math.max(1, Number(yearsTotal) || 1);
    const delay = Math.min(Math.max(0, Number(delayYears) || 0), total - 1);
    const monthlyContribution = Math.max(0, Number(monthly) || 0);
    const rMonthly = (Number(annualReturn) || 0) / 100 / 12;

    const series = [];

    for (let year = 0; year <= total; year++) {
      const months = year * 12;

      let early = 0;
      let late = 0;

      for (let m = 0; m < months; m++) {
        // early investor starts immediately
        early = (early + monthlyContribution) * (1 + rMonthly);

        // late investor only starts adding after delay period
        if (m >= delay * 12) {
          late = (late + monthlyContribution) * (1 + rMonthly);
        } else {
          late = late * (1 + rMonthly);
        }
      }

      series.push({
        year,
        early,
        late,
      });
    }

    return series;
  }, [monthly, yearsTotal, delayYears, annualReturn]);

  const final = data[data.length - 1] || { early: 0, late: 0 };
  const gap = final.early - final.late;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Cost of waiting to invest
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Compare starting to invest now vs waiting a few years. Same amount
          each month, same average return – the only difference is when you
          begin.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.05fr,1.1fr]">
        {/* LEFT: controls + summary */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs sm:text-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-50">
            Your scenario
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 text-[11px] sm:text-xs">
            <div className="space-y-1">
              <label className="block text-slate-300">
                Monthly investment (£)
              </label>
              <input
                type="number"
                min={0}
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                className="w-full rounded-md bg-slate-950 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-emerald-400"
              />
              <p className="text-[10px] text-slate-400">
                This is the amount you&apos;d put aside every month.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300">
                Investment horizon (years)
              </label>
              <input
                type="range"
                min={5}
                max={50}
                value={yearsTotal}
                onChange={(e) =>
                  setYearsTotal(Math.max(5, Number(e.target.value)))
                }
                className="w-full accent-emerald-500"
              />
              <p className="text-[10px] text-slate-400">
                Total time invested: <span className="font-semibold">{yearsTotal}</span>{" "}
                years.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300">
                Annual return (average, %)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                step={0.1}
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value))}
                className="w-full rounded-md bg-slate-950 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-emerald-400"
              />
              <p className="text-[10px] text-slate-400">
                Long-term stock markets have historically returned around 5–7%
                above inflation.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300">
                Years you wait before starting
              </label>
              <input
                type="range"
                min={0}
                max={Math.max(1, yearsTotal - 1)}
                value={delayYears}
                onChange={(e) => setDelayYears(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <p className="text-[10px] text-slate-400">
                Delay: <span className="font-semibold">{delayYears}</span>{" "}
                {delayYears === 1 ? "year" : "years"}.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-[11px]">
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-3 space-y-1">
              <p className="text-slate-300">If you start now</p>
              <p className="text-sm font-semibold text-emerald-400">
                {formatMoney(final.early || 0)}
              </p>
              <p className="text-[10px] text-slate-400">
                Investing every month for the full {yearsTotal} years.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-3 space-y-1">
              <p className="text-slate-300">If you wait {delayYears} years</p>
              <p className="text-sm font-semibold text-slate-50">
                {formatMoney(final.late || 0)}
              </p>
              <p className="text-[10px] text-slate-400">
                Same monthly amount, but fewer years in the market.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-3 space-y-1">
              <p className="text-slate-300">Cost of delay</p>
              <p
                className={`text-sm font-semibold ${
                  gap >= 0 ? "text-rose-400" : "text-slate-50"
                }`}
              >
                {formatMoney(gap || 0)}
              </p>
              <p className="text-[10px] text-slate-400">
                The extra you&apos;d have if you started now instead of
                waiting.
              </p>
            </div>
          </div>

          <p className="text-[10px] text-slate-500">
            This is a simplified compound interest illustration. Real investment
            returns are volatile and never guaranteed. This is not financial
            advice.
          </p>
        </section>

        {/* RIGHT: chart */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs sm:text-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-50">
            Growth over time
          </h2>
          <p className="text-[11px] text-slate-300">
            Both lines use the same monthly contribution and average return. The
            only difference is when the contributions begin.
          </p>

          <div className="mt-2 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickMargin={4}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) =>
                    formatMoney(typeof value === "number" ? value : 0)
                  }
                  labelFormatter={(label) => `Year ${label}`}
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
                  dataKey="early"
                  name="Start now"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="late"
                  name="Start later"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-slate-300 space-y-1.5">
            <p className="font-semibold text-slate-100">
              What you&apos;re seeing
            </p>
            <p>
              The gap between the green and blue lines is the cost of waiting –
              not because you invest less money overall, but because your money
              has fewer years to compound.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
