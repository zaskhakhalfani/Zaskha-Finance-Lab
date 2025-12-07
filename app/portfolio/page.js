// app/portfolio/page.js
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ---------------------------------------------------------------------
// Config: asset classes (purely educational, NOT advice)
// ---------------------------------------------------------------------
const ASSET_CLASSES = [
  {
    key: "devEquities",
    label: "Developed market stocks",
    description: "Large companies in the US, UK, Europe, Japan.",
    expectedReturn: 0.07,
    volatility: 0.15,
  },
  {
    key: "emEquities",
    label: "Emerging market stocks",
    description: "Faster-growing economies like India, Brazil, Indonesia.",
    expectedReturn: 0.09,
    volatility: 0.2,
  },
  {
    key: "globalBonds",
    label: "Global government bonds",
    description: "Typically steadier than stocks; lower return.",
    expectedReturn: 0.03,
    volatility: 0.06,
  },
  {
    key: "corpBonds",
    label: "Corporate bonds",
    description:
      "Loans to companies – slightly more risk & return than gov. bonds.",
    expectedReturn: 0.04,
    volatility: 0.08,
  },
  {
    key: "cash",
    label: "Cash & savings",
    description: "Cash, savings accounts, money market funds.",
    expectedReturn: 0.015,
    volatility: 0.01,
  },
  {
    key: "crypto",
    label: "Crypto (experimental)",
    description:
      "Very high risk / speculative – only for money you can afford to lose.",
    expectedReturn: 0.15,
    volatility: 0.6,
  },
];

// ---------------------------------------------------------------------
// Presets – weights must use the SAME keys as ASSET_CLASSES
// (weights here sum to 100; we still re-normalise just in case)
// ---------------------------------------------------------------------
const PRESETS = {
  // Very bond-heavy, low equity, tiny crypto
  conservative: {
    devEquities: 20,
    emEquities: 5,
    globalBonds: 45,
    corpBonds: 20,
    cash: 8,
    crypto: 2,
  },

  // Middle ground: decent equity, solid bonds, tiny crypto
  balanced: {
    devEquities: 35,
    emEquities: 10,
    globalBonds: 25,
    corpBonds: 18,
    cash: 10,
    crypto: 2,
  },

  // High equity, small bonds, more crypto – clearly aggressive
  aggressive: {
    devEquities: 55,
    emEquities: 20,
    globalBonds: 5,
    corpBonds: 5,
    cash: 5,
    crypto: 10,
  },
};

const COLORS = ["#22c55e", "#38bdf8", "#f97316", "#a855f7", "#e5e7eb", "#facc15"];

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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

// Rough risk score from weighted volatility
function computeRiskScore(weights) {
  let vol = 0;
  for (const asset of ASSET_CLASSES) {
    vol += ((weights[asset.key] ?? 0) / 100) * asset.volatility;
  }
  // 0.2 volatility ~ risk score 10 (very volatile)
  const score = (vol / 0.2) * 10;
  return clamp(score, 1, 10);
}

// Very simple drawdown illustration (educational only)
function computeDrawdownSnapshot(weights) {
  let vol = 0;
  for (const asset of ASSET_CLASSES) {
    vol += ((weights[asset.key] ?? 0) / 100) * asset.volatility;
  }

  const mild = -(vol * 0.6); // e.g. -9% if vol 15%
  const rough = -(vol * 1.2);
  const crash = -(vol * 2.0);

  return { mild, rough, crash };
}

// Project portfolio with monthly contributions
function projectPortfolio({
  years,
  monthlyContribution,
  portfolioReturn,
  inflation,
}) {
  const months = years * 12;
  const rMonthly = portfolioReturn / 12;
  const inflationMonthly = inflation / 12;

  let balanceNominal = 0;
  let priceLevel = 1;
  let totalContrib = 0;
  const data = [];

  for (let m = 0; m <= months; m++) {
    if (m > 0) {
      balanceNominal = balanceNominal * (1 + rMonthly) + monthlyContribution;
      totalContrib += monthlyContribution;
      priceLevel *= 1 + inflationMonthly;
    }

    if (m % 12 === 0) {
      const year = m / 12;
      const realValue = priceLevel > 0 ? balanceNominal / priceLevel : balanceNominal;
      data.push({
        year,
        portfolio: balanceNominal,
        real: realValue,
        contributions: totalContrib,
      });
    }
  }

  return data;
}

// Find breakeven / compounding milestones
function findMilestones(data) {
  let breakevenYear = null;
  let compBeatsContribYear = null;

  for (const point of data) {
    if (point.year === 0) continue;

    if (!breakevenYear && point.portfolio >= point.contributions) {
      breakevenYear = point.year;
    }
    const growth = point.portfolio - point.contributions;
    if (!compBeatsContribYear && growth >= point.contributions) {
      compBeatsContribYear = point.year;
    }
  }

  return { breakevenYear, compBeatsContribYear };
}

// Tooltip for projection chart
function ProjectionTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/95 px-4 py-3 text-xs text-slate-100 shadow-xl">
      <p className="font-semibold mb-1">Year {label}</p>
      <p className="text-[11px] text-emerald-300">
        Portfolio value: {formatMoney(d.portfolio)}
      </p>
      <p className="text-[11px] text-sky-300">
        Inflation-adjusted: {formatMoney(d.real)}
      </p>
      <p className="text-[11px] text-slate-400 mt-1">
        Total contributed: {formatMoney(d.contributions)}
      </p>
    </div>
  );
}

// Map risk score → human label
function classifyRisk(score) {
  // Tuned so your presets feel right:
  // 1–5  = Conservative
  // 5–8.5 = Balanced
  // 8.5–10 = Aggressive
  if (score < 5) return "Conservative";
  if (score < 8.5) return "Balanced";
  return "Aggressive";
}

// ---------------------------------------------------------------------
// Small components
// ---------------------------------------------------------------------
function SliderRow({ asset, value, onChange, normalised }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex flex-col">
          <span className="font-medium text-slate-100">{asset.label}</span>
          <span className="text-[11px] text-slate-400">
            {asset.description}
          </span>
        </div>
        <span className="text-[11px] text-slate-300 tabular-nums">
          {normalised.toFixed(1)}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={80}
        step={5}
        value={value}
        onChange={(e) => onChange(asset.key, Number(e.target.value))}
        className="w-full accent-emerald-400"
      />
    </div>
  );
}

// ---------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------
export default function PortfolioPage() {
  // Preset & weights (raw slider values)
  const [preset, setPreset] = useState("balanced");
  const [weights, setWeights] = useState(PRESETS.balanced);

  // Planning inputs
  const [years, setYears] = useState(25);
  const [monthlyContribution, setMonthlyContribution] = useState(300);
  const [inflation, setInflation] = useState(0.03);

  // Fees
  const [feePercent, setFeePercent] = useState(0.005); // 0.5%

  // Tutor UX
  const [copied, setCopied] = useState(false);

  const handleWeightChange = (key, value) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (name) => {
    setPreset(name);
    setWeights(PRESETS[name]);
  };

  // Slider total (not normalised)
  const sliderTotal = useMemo(
    () => Object.values(weights).reduce((sum, v) => sum + v, 0),
    [weights]
  );

  // Normalise weights so they always sum to 100 for calculations
  const normalisedWeights = useMemo(() => {
    if (sliderTotal === 0) return { ...weights };
    const factor = 100 / sliderTotal;
    const out = {};
    for (const asset of ASSET_CLASSES) {
      out[asset.key] = (weights[asset.key] ?? 0) * factor;
    }
    return out;
  }, [weights, sliderTotal]);

  // Portfolio stats
  const { expectedReturn, riskScore } = useMemo(() => {
    let ret = 0;
    for (const asset of ASSET_CLASSES) {
      const w = (normalisedWeights[asset.key] ?? 0) / 100;
      ret += w * asset.expectedReturn;
    }
    const risk = computeRiskScore(normalisedWeights);
    return { expectedReturn: ret, riskScore: risk };
  }, [normalisedWeights]);

  const netReturn = useMemo(
    () => Math.max(expectedReturn - feePercent, 0),
    [expectedReturn, feePercent]
  );

  const drawdown = useMemo(
    () => computeDrawdownSnapshot(normalisedWeights),
    [normalisedWeights]
  );

  // Projection data
  const projection = useMemo(
    () =>
      projectPortfolio({
        years,
        monthlyContribution,
        portfolioReturn: netReturn,
        inflation,
      }),
    [years, monthlyContribution, netReturn, inflation]
  );

  const noFeeProjection = useMemo(
    () =>
      projectPortfolio({
        years,
        monthlyContribution,
        portfolioReturn: expectedReturn,
        inflation,
      }),
    [years, monthlyContribution, expectedReturn, inflation]
  );

  const milestones = useMemo(() => findMilestones(projection), [projection]);

  const finalPoint = projection[projection.length - 1] ?? {
    portfolio: 0,
    real: 0,
    contributions: 0,
  };
  const finalNoFee = noFeeProjection[noFeeProjection.length - 1] ?? {
    portfolio: 0,
  };

  const projectedFutureValue = finalPoint.portfolio;
  const projectedRealValue = finalPoint.real;
  const totalContributions = finalPoint.contributions;
  const lostToFees = Math.max(finalNoFee.portfolio - finalPoint.portfolio, 0);

  // Copy tutor prompt
  async function handleCopyPrompt() {
    const mixLines = ASSET_CLASSES.map(
      (a) => `${a.label}: ${(normalisedWeights[a.key] ?? 0).toFixed(1)}%`
    ).join(", ");

    const text = `Explain this portfolio in simple terms for a beginner: ${mixLines}. Risk score around ${riskScore.toFixed(
      1
    )}/10, expected net return about ${formatPercent(
      netReturn
    )} per year, with inflation assumed at ${formatPercent(
      inflation
    )}. What are the main risks, and what kind of investor might this mix suit?`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-400">
          Portfolio Builder
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">
          Experiment with different mixes of assets and see how risk and
          long-term growth might change.
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          This is an educational sandbox. None of this is financial advice or a
          forecast. It&apos;s just a way to see how decisions about risk, fees,
          and inflation can shape your future wealth.
        </p>
      </header>

      {/* Allocation & presets */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase text-slate-300 tracking-wide">
              Asset allocation (by % of portfolio)
            </p>
            <p className="text-[11px] text-slate-500">
              Drag the sliders to build a mix. We normalise it back to 100%.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-400">Slider total</p>
            <p
              className={
                "text-xs font-semibold tabular-nums " +
                (sliderTotal === 100 ? "text-emerald-400" : "text-amber-400")
              }
            >
              {sliderTotal.toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ASSET_CLASSES.map((asset) => (
            <SliderRow
              key={asset.key}
              asset={asset}
              value={weights[asset.key] ?? 0}
              normalised={normalisedWeights[asset.key] ?? 0}
              onChange={handleWeightChange}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-2 items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] text-slate-400">Quick presets:</span>
            {["conservative", "balanced", "aggressive"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => applyPreset(p)}
                className={
                  "px-3 py-1.5 rounded-full text-[11px] border transition " +
                  (preset === p
                    ? "bg-slate-100 text-slate-900 border-slate-100"
                    : "bg-slate-900 text-slate-100 border-slate-700 hover:border-slate-500")
                }
              >
                {p[0].toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            Educational only – not personalised investment advice.
          </p>
        </div>
      </section>

      {/* Risk / fees / donut */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
        {/* Left: risk & fees */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-300 font-semibold">
                Risk, return & fees
              </p>
              <p className="text-[11px] text-slate-500">
                Based on long-run asset class assumptions – not guarantees.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-400">Net expected return</p>
              <p className="text-lg font-semibold text-emerald-400">
                {formatPercent(netReturn, 1)}
              </p>
              <p className="text-[11px] text-slate-500">
                Before inflation, after fees
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-[11px] text-slate-400 mb-1">
                Risk score (1–10)
              </p>
              <p className="text-xl font-semibold text-amber-300">
                {riskScore.toFixed(1)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Higher = bigger ups and downs.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Feels like:{" "}
                <span className="font-semibold">
                  {classifyRisk(riskScore)}
                </span>{" "}
                strategy.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-[11px] text-slate-400 mb-1">
                Drawdown snapshot
              </p>
              <p className="text-[11px] text-slate-300">
                Mild year:{" "}
                <span className="text-amber-200">
                  {formatPercent(drawdown.mild, 1)}
                </span>
              </p>
              <p className="text-[11px] text-slate-300">
                Rough year:{" "}
                <span className="text-amber-300">
                  {formatPercent(drawdown.rough, 1)}
                </span>
              </p>
              <p className="text-[11px] text-slate-300">
                Crash year:{" "}
                <span className="text-rose-400">
                  {formatPercent(drawdown.crash, 1)}
                </span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                These are rough, illustrative ranges – not predictions.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-[11px] text-slate-400 mb-1">
                Lost to fees (estimate)
              </p>
              <p className="text-sm font-semibold text-slate-100">
                {formatMoney(lostToFees)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Difference compared with the same mix at 0% annual fees over{" "}
                {years} years.
              </p>
            </div>
          </div>

          {/* Fee slider */}
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Annual fee assumption</span>
              <span className="tabular-nums text-slate-200">
                {(feePercent * 100).toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={0.05}
              value={feePercent * 100}
              onChange={(e) => setFeePercent(Number(e.target.value) / 100)}
              className="w-full accent-emerald-400"
            />
            <p className="text-[11px] text-slate-500">
              Many index funds cost around 0.1–0.3% per year. Some active funds
              can charge 1%+.
            </p>
          </div>
        </div>

        {/* Right: donut chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col gap-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-300 font-semibold">
            Allocation snapshot
          </p>
          <div className="flex items-center gap-4">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ASSET_CLASSES.map((a) => ({
                      name: a.label,
                      value: normalisedWeights[a.key] ?? 0,
                    }))}
                    dataKey="value"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={1.5}
                  >
                    {ASSET_CLASSES.map((a, i) => (
                      <Cell
                        key={a.key}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1 text-[11px]">
              {ASSET_CLASSES.map((a, i) => (
                <div
                  key={a.key}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-sm"
                      style={{
                        backgroundColor: COLORS[i % COLORS.length],
                      }}
                    />
                    <span className="text-slate-200 truncate">
                      {a.label}
                    </span>
                  </div>
                  <span className="tabular-nums text-slate-400">
                    {(normalisedWeights[a.key] ?? 0).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            We normalise the sliders so your portfolio always sums to 100%.
          </p>
        </div>
      </section>

      {/* Goal planner + projection chart */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
        {/* Left: planner & milestones */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 text-xs">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-300 font-semibold">
              Goal & contributions
            </p>
            <p className="text-[11px] text-slate-500">
              Adjust horizon, monthly investment, and inflation assumption.
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">Years invested</span>
              <span className="text-[11px] text-slate-200">{years} years</span>
            </label>
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={years}
              onChange={(e) =>
                setYears(clamp(Number(e.target.value) || 5, 5, 50))
              }
              className="w-full accent-emerald-400"
            />

            <label className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Monthly contribution
              </span>
              <span className="text-[11px] text-slate-200">
                {formatMoney(monthlyContribution)}
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={2000}
              step={25}
              value={monthlyContribution}
              onChange={(e) =>
                setMonthlyContribution(Math.max(Number(e.target.value) || 0, 0))
              }
              className="w-full accent-emerald-400"
            />

            <label className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Inflation assumption
              </span>
              <span className="text-[11px] text-slate-200">
                {formatPercent(inflation, 1)} / year
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={0.08}
              step={0.005}
              value={inflation}
              onChange={(e) =>
                setInflation(clamp(Number(e.target.value) || 0, 0, 0.08))
              }
              className="w-full accent-emerald-400"
            />
          </div>

          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 space-y-1">
            <p className="text-[11px] text-slate-400">
              After {years} years, you would have paid in:
            </p>
            <p className="text-xs text-slate-100 font-semibold">
              {formatMoney(totalContributions)}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              Projected portfolio value (future £):
            </p>
            <p className="text-xs text-emerald-400 font-semibold">
              {formatMoney(projectedFutureValue)}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              In today&apos;s money (after inflation):
            </p>
            <p className="text-xs text-emerald-300 font-semibold">
              {formatMoney(projectedRealValue)}
            </p>
          </div>

          {(milestones.breakevenYear || milestones.compBeatsContribYear) && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-[11px] text-slate-400 mb-1">
                Milestones (illustrative)
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                {milestones.breakevenYear && (
                  <li>
                    Around year{" "}
                    <span className="font-semibold">
                      {milestones.breakevenYear}
                    </span>{" "}
                    your portfolio may be worth more than you&apos;ve paid in.
                  </li>
                )}
                {milestones.compBeatsContribYear && (
                  <li>
                    Around year{" "}
                    <span className="font-semibold">
                      {milestones.compBeatsContribYear}
                    </span>{" "}
                    compounding growth could overtake your total
                    contributions.
                  </li>
                )}
              </ul>
              <p className="text-[10px] text-slate-500 mt-2">
                Real markets are messy – this just shows how compounding *can*
                behave under smooth assumptions.
              </p>
            </div>
          )}
        </div>

        {/* Right: chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-300 font-semibold">
                Growth over time (illustration)
              </p>
              <p className="text-[11px] text-slate-500">
                Green line: portfolio. Grey line: total you contributed. Blue
                line: portfolio in today&apos;s money.
              </p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projection}>
                <XAxis
                  dataKey="year"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatMoney(v)}
                />
                <Tooltip content={<ProjectionTooltip />} />
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  name="Portfolio (future £)"
                />
                <Line
                  type="monotone"
                  dataKey="real"
                  stroke="#38bdf8"
                  strokeWidth={1.7}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Portfolio (today's £)"
                />
                <Line
                  type="monotone"
                  dataKey="contributions"
                  stroke="#64748b"
                  strokeWidth={1.3}
                  strokeDasharray="3 3"
                  dot={false}
                  name="Total contributed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[10px] text-slate-500">
            We assume smooth average returns each year. In reality, markets
            bounce around – sometimes sharply – from year to year.
          </p>
        </div>
      </section>

      

      {/* Tutor prompt section */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-300 font-semibold">
            Step 3 – Ask the AI tutor
          </p>
          <p className="text-[11px] text-slate-500 max-w-xl">
            Want a plain-English explanation of this portfolio? Copy a
            ready-made prompt and paste it into the tutor on the{" "}
            <Link href="/learn" className="text-emerald-400 hover:underline">
              Learn
            </Link>{" "}
            page.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopyPrompt}
          className="px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400 transition"
        >
          {copied ? "Prompt copied ✔" : "Copy tutor prompt"}
        </button>
      </section>
    </div>
  );
}
