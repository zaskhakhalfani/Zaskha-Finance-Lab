// app/api/market/route.js
import { NextResponse } from "next/server";

/**
 * Market data endpoint.
 *
 * - Developed stocks proxy: SPY (S&P 500 ETF) from Stooq (CSV)
 * - Crypto: BTC-USD from CoinGecko
 *
 * No API keys needed.
 */
export async function GET() {
  try {
    // 1) Fetch SPY daily data from Stooq (CSV)
    const spyRes = await fetch(
      "https://stooq.com/q/d/l/?s=spy.us&i=d",
      {
        // helps with some providers being picky
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; ZaskhaFinanceLab/1.0; +http://localhost)",
        },
      }
    );

    // 2) Fetch BTC market chart from CoinGecko (last 365 days)
    const btcRes = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily"
    );

    if (!spyRes.ok || !btcRes.ok) {
      const t1 = await spyRes.text();
      const t2 = await btcRes.text();
      console.error("Market provider error:", t1.slice(0, 200), t2.slice(0, 200));
      return NextResponse.json(
        { error: "Error from market data providers." },
        { status: 500 }
      );
    }

    // ---- Parse SPY CSV ----
    const spyCsv = await spyRes.text();
    const spyLines = spyCsv.trim().split("\n");
    // First line is header: Date,Open,High,Low,Close,Volume
    const spySeries = spyLines
      .slice(1)
      .map((line) => line.split(","))
      .filter((cols) => cols.length >= 5)
      .map((cols) => {
        const [date, , , , close] = cols;
        return {
          date, // YYYY-MM-DD
          close: Number(close),
        };
      })
      .filter((d) => d.close > 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

          // Keep only roughly the last 1 year of SPY data
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const spySeriesRecent = spySeries.filter(
      (d) => new Date(d.date) >= oneYearAgo
    );

    // If the filter somehow returns nothing (provider glitch), fall back to last 252 points
    const spySeriesFinal =
      spySeriesRecent.length > 10 ? spySeriesRecent : spySeries.slice(-252);


    // ---- Parse BTC JSON ----
    const btcJson = await btcRes.json();
    const btcSeries =
      btcJson.prices?.map(([ts, price]) => ({
        date: new Date(ts).toISOString().slice(0, 10),
        close: Number(price),
      })) || [];

    // Basic safety: if both are empty, scream
    if (spySeries.length === 0 && btcSeries.length === 0) {
      console.error("No data returned from providers:", spyCsv.slice(0, 200), btcJson);
      return NextResponse.json(
        {
          error:
            "No market data available from providers. Please try again later.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      devStocks: {
        symbol: "SPY",
        series: spySeriesFinal,
      },
      crypto: {
        symbol: "BTC-USD",
        series: btcSeries,
      },
    });
  } catch (err) {
    console.error("Market route error:", err);
    return NextResponse.json(
      { error: "Unexpected server error in /api/market" },
      { status: 500 }
    );
  }
}
