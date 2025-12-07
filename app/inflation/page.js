// app/inflation/page.js
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import SectionCard from "@/components/SectionCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

// ---------------------------------------------------------------------
// Country list & World Bank codes (for live CPI inflation data)
// ---------------------------------------------------------------------
const COUNTRIES = [
  { code: "GBR", label: "United Kingdom" },
  { code: "USA", label: "United States" },
  { code: "EMU", label: "Euro area" },
  { code: "JPN", label: "Japan" },
  { code: "IDN", label: "Indonesia" },
  { code: "IND", label: "India" },
  { code: "BRA", label: "Brazil" },
  { code: "CHN", label: "China" },
  { code: "DEU", label: "Germany" },
  { code: "FRA", label: "France" },
  { code: "CAN", label: "Canada" },
  { code: "ZAF", label: "South Africa" },
];

const DEFAULT_PRIMARY = "GBR";
const DEFAULT_SECONDARY = "USA";

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function formatMoney(value) {
  if (!isFinite(value)) return "£0";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return (
      "£" +
      (value / 1_000_000)
        .toFixed(1)
        .replace(/\.0$/, "") +
      "m"
    );
  }
  if (abs >= 1_000) {
    return (
      "£" +
      (value / 1_000)
        .toFixed(1)
        .replace(/\.0$/, "") +
      "k"
    );
  }
  return (
    "£" +
    value
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}

function formatPercent(value, decimals = 1) {
  if (!isFinite(value)) return "0%";
  return (value * 100).toFixed(decimals) + "%";
}

// Basic time-value calculations
function computeScenario({
  startingAmount,
  years,
  inflationRate,
  bankRate,
  investReturn,
}) {
  const gInfl = 1 + inflationRate;
  const gCash = 1 + bankRate;
  const gInvest = 1 + investReturn;

  const futureCash = startingAmount * gCash ** years;
  const realCash = futureCash / gInfl ** years;

  const futureInvest = startingAmount * gInvest ** years;
  const realInvest = futureInvest / gInfl ** years;

  const realLossCash = realCash - startingAmount;
  const realGainInvestVsCash = realInvest - realCash;

  const priceMultiplier = gInfl ** years;
  const neededToMatchToday = startingAmount * priceMultiplier;

  return {
    futureCash,
    realCash,
    futureInvest,
    realInvest,
    realLossCash,
    realGainInvestVsCash,
    priceMultiplier,
    neededToMatchToday,
  };
}

// Tooltip for the comparison chart
function InflationTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/95 px-3 py-2 text-[11px] text-slate-100 shadow-xl">
      <p className="font-semibold mb-1">Year {label}</p>
      {typeof d.primary === "number" && (
        <p className="text-emerald-300">
          {d.primaryLabel}: {d.primary.toFixed(1)}%
        </p>
      )}
      {typeof d.secondary === "number" && (
        <p className="text-sky-300">
          {d.secondaryLabel}: {d.secondary.toFixed(1)}%
        </p>
      )}
    </div>
  );
}

// Fetch CPI inflation (% YoY) from World Bank for a single country code
async function fetchInflationSeries(code) {
  const url = `https://api.worldbank.org/v2/country/${code}/indicator/FP.CPI.TOTL.ZG?format=json&per_page=80`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch inflation data");
  }
  const json = await res.json();
  const rows = json[1] || [];

  // Filter out missing values, convert, sort oldest -> newest, keep last ~20 years
  const cleaned = rows
    .filter((d) => d.value !== null && d.date)
    .map((d) => ({
      year: Number(d.date),
      value: Number(d.value),
    }))
    .sort((a, b) => a.year - b.year)
    .slice(-22); // ~last 22 years

  return cleaned;
}

// ---------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------
export default function InflationPage() {
  // Simulator state
  const [startingAmount, setStartingAmount] = useState(1000);
  const [years, setYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(0.05);
  const [bankRate, setBankRate] = useState(0.005);
  const [investReturn, setInvestReturn] = useState(0.06);

  // Chart state: country selection + live data
  const [primaryCode, setPrimaryCode] = useState(DEFAULT_PRIMARY);
  const [secondaryCode, setSecondaryCode] = useState(DEFAULT_SECONDARY);
  const [primarySeries, setPrimarySeries] = useState([]);
  const [secondarySeries, setSecondarySeries] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);

  const scenario = useMemo(
    () =>
      computeScenario({
        startingAmount,
        years,
        inflationRate,
        bankRate,
        investReturn,
      }),
    [startingAmount, years, inflationRate, bankRate, investReturn]
  );

  // Fetch real inflation data when either country selection changes
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setChartLoading(true);
        setChartError(null);

        const tasks = [
          fetchInflationSeries(primaryCode).then((data) => ({
            key: "primary",
            data,
          })),
        ];

        if (secondaryCode) {
          tasks.push(
            fetchInflationSeries(secondaryCode).then((data) => ({
              key: "secondary",
              data,
            }))
          );
        }

        const results = await Promise.all(tasks);
        if (cancelled) return;

        const primary = results.find((r) => r.key === "primary")?.data ?? [];
        const secondary = results.find((r) => r.key === "secondary")?.data ?? [];

        setPrimarySeries(primary);
        setSecondarySeries(secondary);
      } catch (err) {
        console.error(err);
        if (!cancelled) setChartError("Couldn’t load inflation data right now.");
      } finally {
        if (!cancelled) setChartLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [primaryCode, secondaryCode]);

  // Labels for legend & tooltip
  const primaryLabel =
    COUNTRIES.find((c) => c.code === primaryCode)?.label || "Primary";
  const secondaryLabel = secondaryCode
    ? COUNTRIES.find((c) => c.code === secondaryCode)?.label || "Secondary"
    : "";

  // Merge series by year so chart can show both
  const mergedSeries = useMemo(() => {
    const map = new Map();

    primarySeries.forEach((d) => {
      map.set(d.year, {
        year: d.year,
        primary: d.value,
      });
    });

    secondarySeries.forEach((d) => {
      const existing = map.get(d.year) || { year: d.year };
      map.set(d.year, {
        ...existing,
        secondary: d.value,
      });
    });

    return Array.from(map.values())
      .sort((a, b) => a.year - b.year)
      .map((row) => ({
        ...row,
        primaryLabel,
        secondaryLabel,
      }));
  }, [primarySeries, secondarySeries, primaryLabel, secondaryLabel]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-400">
          Inflation Lab
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">
          See how inflation quietly changes the value of your money.
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Explore how rising prices affect savings, cash in the bank, and
          investing over time. Then dive into interactive tools to test your
          own numbers.
        </p>
      </header>

      {/* Simulator */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)]">
        {/* LEFT: Controls */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 text-xs">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-300 font-semibold">
              Simple inflation simulator
            </p>
            <p className="text-[11px] text-slate-500">
              Choose an amount, time horizon, inflation rate, and two simple
              return assumptions.
            </p>
          </div>

          <div className="space-y-3">
            {/* Starting amount */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Starting amount</span>
                <span className="text-slate-200">
                  {formatMoney(startingAmount)}
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={20000}
                step={100}
                value={startingAmount}
                onChange={(e) =>
                  setStartingAmount(
                    clamp(Number(e.target.value) || 100, 100, 20000)
                  )
                }
                className="w-full accent-emerald-400"
              />
            </div>

            {/* Years */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Years</span>
                <span className="text-slate-200">{years} years</span>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                step={1}
                value={years}
                onChange={(e) =>
                  setYears(clamp(Number(e.target.value) || 1, 1, 40))
                }
                className="w-full accent-emerald-400"
              />
            </div>

            {/* Inflation */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Inflation rate</span>
                <span className="text-slate-200">
                  {formatPercent(inflationRate, 1)} / year
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={0.12}
                step={0.005}
                value={inflationRate}
                onChange={(e) =>
                  setInflationRate(
                    clamp(Number(e.target.value) || 0, 0, 0.12)
                  )
                }
                className="w-full accent-emerald-400"
              />
            </div>

            {/* Bank rate */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Bank interest rate</span>
                <span className="text-slate-200">
                  {formatPercent(bankRate, 1)} / year
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={0.06}
                step={0.0025}
                value={bankRate}
                onChange={(e) =>
                  setBankRate(clamp(Number(e.target.value) || 0, 0, 0.06))
                }
                className="w-full accent-emerald-400"
              />
            </div>

            {/* Investment return */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Simple investing return</span>
                <span className="text-slate-200">
                  {formatPercent(investReturn, 1)} / year
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={0.12}
                step={0.005}
                value={investReturn}
                onChange={(e) =>
                  setInvestReturn(
                    clamp(Number(e.target.value) || 0, 0, 0.12)
                  )
                }
                className="w-full accent-emerald-400"
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-500 mt-2">
            Returns here are smooth, average assumptions for learning – not
            guarantees or advice.
          </p>
        </div>

        {/* RIGHT: Explanation */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 text-xs sm:text-sm">
          <h2 className="text-sm font-semibold text-slate-50">
            What happens to your money in real terms?
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 space-y-1.5">
              <p className="text-[11px] text-slate-400">Cash in the bank</p>
              <p className="text-xs text-slate-200">
                Future account balance:{" "}
                <span className="font-semibold">
                  {formatMoney(scenario.futureCash)}
                </span>
              </p>
              <p className="text-xs text-slate-200">
                In today&apos;s money:{" "}
                <span className="font-semibold">
                  {formatMoney(scenario.realCash)}
                </span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Real gain/loss vs today:{" "}
                <span
                  className={
                    "font-semibold " +
                    (scenario.realLossCash >= 0
                      ? "text-emerald-300"
                      : "text-rose-300")
                  }
                >
                  {scenario.realLossCash >= 0 ? "+" : ""}
                  {formatMoney(scenario.realLossCash)}
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 space-y-1.5">
              <p className="text-[11px] text-slate-400">
                Simple investing pot
              </p>
              <p className="text-xs text-slate-200">
                Future portfolio:{" "}
                <span className="font-semibold">
                  {formatMoney(scenario.futureInvest)}
                </span>
              </p>
              <p className="text-xs text-slate-200">
                In today&apos;s money:{" "}
                <span className="font-semibold">
                  {formatMoney(scenario.realInvest)}
                </span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Extra real value vs leaving all in cash:{" "}
                <span
                  className={
                    "font-semibold " +
                    (scenario.realGainInvestVsCash >= 0
                      ? "text-emerald-300"
                      : "text-rose-300")
                  }
                >
                  {scenario.realGainInvestVsCash >= 0 ? "+" : ""}
                  {formatMoney(scenario.realGainInvestVsCash)}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-[11px] text-slate-300 space-y-1.5">
            <p>
              Over {years} years with{" "}
              <span className="font-semibold">
                {formatPercent(inflationRate, 1)} inflation
              </span>
              , prices are about{" "}
              <span className="font-semibold">
                {(scenario.priceMultiplier - 1 > 0
                  ? (scenario.priceMultiplier - 1) * 100
                  : 0
                ).toFixed(1)}
                %
              </span>{" "}
              higher than today.
            </p>
            <p>
              To buy what {formatMoney(startingAmount)} buys today, you&apos;d
              need about{" "}
              <span className="font-semibold">
                {formatMoney(scenario.neededToMatchToday)}
              </span>{" "}
              in the future.
            </p>
          </div>
        </div>
      </section>

      {/* Real-world inflation chart with country comparator */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-300 font-semibold">
              Real-world inflation (annual %)
            </p>
            <p className="text-[11px] text-slate-500 max-w-xl">
              Compare how inflation has behaved in different economies. Data
              comes from the World Bank&apos;s CPI inflation (% change) series.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Primary</span>
              <select
                value={primaryCode}
                onChange={(e) => setPrimaryCode(e.target.value)}
                className="rounded-full border border-slate-700 bg-slate-900 text-slate-100 px-3 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Compare with</span>
              <select
                value={secondaryCode}
                onChange={(e) => setSecondaryCode(e.target.value || "")}
                className="rounded-full border border-slate-700 bg-slate-900 text-slate-100 px-3 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              >
                <option value="">None</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {chartLoading && (
          <p className="text-[11px] text-slate-500">Loading latest data…</p>
        )}
        {chartError && (
          <p className="text-[11px] text-rose-400">{chartError}</p>
        )}

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedSeries}>
              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                stroke="#64748b"
                tickLine={false}
                axisLine={false}
                fontSize={11}
              />
              <YAxis
                stroke="#64748b"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tickFormatter={(v) => v.toFixed(1) + "%"}
              />
              <Tooltip content={<InflationTooltip />} />
              <Legend
                formatter={(value) =>
                  value === "primary"
                    ? primaryLabel
                    : secondaryLabel || "Secondary"
                }
              />
              <Line
                type="monotone"
                dataKey="primary"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="primary"
                connectNulls
              />
              {secondaryCode && (
                <Line
                  type="monotone"
                  dataKey="secondary"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="secondary"
                  connectNulls
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[10px] text-slate-500">
          Source: World Bank, CPI inflation (FP.CPI.TOTL.ZG). Values are
          approximate and used here for learning, not for trading or official
          analysis.
        </p>
      </section>

      {/* Interactive tools (same 3 cards as home, but contextualised) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-300 font-semibold">
              Explore inflation with interactive tools
            </p>
            <p className="text-[11px] text-slate-500 max-w-xl">
              These sandboxes let you plug in your own numbers – from your
              weekly shop to your pay rises and delayed investing.
            </p>
          </div>
          <Link
            href="/"
            className="text-[11px] text-emerald-400 hover:underline"
          >
            Back to home →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SectionCard
            title="Inflation shopping basket"
            description="Build a basket of everyday items and see how its total cost changes over time with different inflation rates."
          >
            <Link
              href="/tools/shopping-basket"
              className="inline-flex text-xs px-3 py-1.5 rounded-full bg-slate-800 text-slate-100 hover:bg-slate-700"
            >
              Open Basket Visualiser →
            </Link>
          </SectionCard>

          <SectionCard
            title="Real wages checker"
            description="Compare your pay rises with inflation to see if your real income is going up, flat, or quietly shrinking."
          >
            <Link
              href="/tools/real-wage"
              className="inline-flex text-xs px-3 py-1.5 rounded-full bg-slate-800 text-slate-100 hover:bg-slate-700"
            >
              Check Real Wages →
            </Link>
          </SectionCard>

          <SectionCard
            title="Cost of waiting to invest"
            description="Find out how much potential wealth you give up by delaying investing by 1, 3, or 5 years."
          >
            <Link
              href="/tools/cost-of-delay"
              className="inline-flex text-xs px-3 py-1.5 rounded-full bg-slate-800 text-slate-100 hover:bg-slate-700"
            >
              See Cost of Delay →
            </Link>
          </SectionCard>
        </div>
      </section>
    </div>
  );
}
