// app/tools/shopping-basket/page.js
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

const DEFAULT_ITEMS = [
  { id: 1, name: "Groceries", price: 150, quantity: 1 },
  { id: 2, name: "Rent", price: 900, quantity: 1 },
  { id: 3, name: "Transport", price: 80, quantity: 1 },
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

export default function ShoppingBasketPage() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [inflationRate, setInflationRate] = useState(5); // %
  const [years, setYears] = useState(10);

  const addItem = () => {
    const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([
      ...items,
      { id: nextId, name: "New item", price: 10, quantity: 1 },
    ]);
  };

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "name" ? value : Math.max(0, Number(value) || 0),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const basketNowMonthly = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      ),
    [items]
  );

  const basketNowYearly = basketNowMonthly * 12;

  const projectionSeries = useMemo(() => {
    const pi = (Number(inflationRate) || 0) / 100;
    const tYears = Math.max(1, Number(years) || 1);

    const data = [];
    for (let year = 0; year <= tYears; year++) {
      const priceFactor = Math.pow(1 + pi, year);
      const monthly = items.reduce((sum, item) => {
        const base = Number(item.price) || 0;
        const qty = Number(item.quantity) || 0;
        return sum + base * priceFactor * qty;
      }, 0);
      data.push({
        year,
        monthly,
        yearly: monthly * 12,
      });
    }
    return data;
  }, [items, inflationRate, years]);

  const finalYear = projectionSeries[projectionSeries.length - 1];

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Inflation shopping basket
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Build a “basket” of your real-life costs – rent, groceries, transport,
          subscriptions – and see how the total could grow over time with
          inflation. This is a learning tool, not financial advice.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,1.1fr]">
        {/* LEFT: Basket setup */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs sm:text-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-50">
              Your basket
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="text-[11px] px-2 py-1 rounded-full border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition"
            >
              + Add item
            </button>
          </div>

          <div className="overflow-x-auto -mx-2">
            <table className="min-w-full text-[11px] border-separate border-spacing-y-1 px-2">
              <thead className="text-slate-400">
                <tr>
                  <th className="text-left px-2 py-1">Item</th>
                  <th className="text-right px-2 py-1">
                    Price now (£/month)
                  </th>
                  <th className="text-right px-2 py-1">Qty / month</th>
                  <th className="text-right px-2 py-1">Monthly total</th>
                  <th className="px-2 py-1" />
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-2 py-2 text-center text-slate-500"
                    >
                      No items yet. Add rent, groceries, transport, or anything
                      else you regularly pay for.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const monthly =
                      (Number(item.price) || 0) * (Number(item.quantity) || 0);
                    return (
                      <tr
                        key={item.id}
                        className="bg-slate-950/60 border border-slate-800"
                      >
                        <td className="px-2 py-1.5">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              updateItem(item.id, "name", e.target.value)
                            }
                            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-[11px] outline-none focus:border-emerald-400"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          <input
                            type="number"
                            min={0}
                            value={item.price}
                            onChange={(e) =>
                              updateItem(item.id, "price", e.target.value)
                            }
                            className="w-full rounded-md bg-slate-900 border border-slate-700 px-1.5 py-1 text-right text-[11px] outline-none focus:border-emerald-400"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          <input
                            type="number"
                            min={0}
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, "quantity", e.target.value)
                            }
                            className="w-full rounded-md bg-slate-900 border border-slate-700 px-1.5 py-1 text-right text-[11px] outline-none focus:border-emerald-400"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-right text-slate-200">
                          {formatMoney(monthly)}
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-[10px] text-slate-500 hover:text-rose-400"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div>
              <p className="text-slate-400">Total basket cost now (monthly)</p>
              <p className="text-sm font-semibold text-slate-50">
                {formatMoney(basketNowMonthly)}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Total basket cost now (yearly)</p>
              <p className="text-sm font-semibold text-slate-50">
                {formatMoney(basketNowYearly)}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-[11px]">
            <div className="space-y-1">
              <label className="block text-slate-300">
                Inflation rate (per year, %)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                step={0.1}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full rounded-md bg-slate-950 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-emerald-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300">
                Years into the future
              </label>
              <input
                type="range"
                min={1}
                max={30}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <p className="text-slate-400">Years: {years}</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-300">Total in final year (yearly)</p>
              <p className="text-sm font-semibold text-emerald-400">
                {finalYear ? formatMoney(finalYear.yearly) : "£0"}
              </p>
              {finalYear && (
                <p className="text-[10px] text-slate-400">
                  That&apos;s about{" "}
                  <span className="font-semibold">
                    {(
                      (finalYear.yearly / basketNowYearly - 1 || 0) * 100
                    ).toFixed(1)}
                    %
                  </span>{" "}
                  more than today for the same basket.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT: Chart + explanation */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs sm:text-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-50">
            How your basket cost could grow
          </h2>
          <p className="text-[11px] text-slate-300">
            This chart shows the total yearly cost of your basket over time,
            assuming prices rise at{" "}
            <span className="font-semibold">{inflationRate}%</span> per year
            and your quantities stay the same.
          </p>

          <div className="mt-2 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionSeries}>
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
                  dataKey="yearly"
                  name="Yearly basket cost"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-slate-300 space-y-1.5">
            <p className="font-semibold text-slate-100">
              What this means in real life
            </p>
            <p>
              If your income doesn&apos;t keep up with this rising basket cost,
              you effectively become poorer – even if your salary number goes up
              a bit.
            </p>
            <p>
              Use this tool to get a feel for why inflation matters for everyday
              things like rent, food, and transport – not just &quot;the
              economy&quot;.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
