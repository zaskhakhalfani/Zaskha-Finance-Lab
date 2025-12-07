// app/api/uk-macro/route.js
import { NextResponse } from "next/server";

/**
 * Helper: fetch the latest World Bank value for a given indicator.
 * Example indicator codes:
 * - Inflation: FP.CPI.TOTL.ZG
 * - GDP growth: NY.GDP.MKTP.KD.ZG
 * - Unemployment: SL.UEM.TOTL.NE.ZS
 */
async function fetchWorldBankLatest(indicator) {
  const url = `https://api.worldbank.org/v2/country/GBR/indicator/${indicator}?format=json&per_page=60`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 } }); // cache 1h
  if (!res.ok) throw new Error(`World Bank error for ${indicator}`);
  const json = await res.json();
  const [, series] = json;

  // Find the most recent year with a non-null value
  const latest = series.find((row) => row.value !== null);
  if (!latest) return null;

  return {
    year: Number(latest.date),
    value: Number(latest.value),
  };
}

/**
 * Very simple scrape of current Bank Rate from the BoE web page.
 * Not perfect, but fine for an educational toy project.
 */
async function fetchBankRate() {
  const res = await fetch("https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp", {
    next: { revalidate: 60 * 15 }, // 15 mins
  });
  if (!res.ok) throw new Error("Bank Rate fetch failed");
  const html = await res.text();

  // Very crude regex: looks for something like "Bank Rate is 5.25%"
  const match = html.match(/Bank Rate[^0-9]*([0-9.]+)\s*%/i);
  if (!match) return null;

  return {
    value: Number(match[1]),
    source: "Bank of England",
  };
}

export async function GET() {
  try {
    const [inflation, gdp, unemployment, bankRate] = await Promise.all([
      fetchWorldBankLatest("FP.CPI.TOTL.ZG"),
      fetchWorldBankLatest("NY.GDP.MKTP.KD.ZG"),
      fetchWorldBankLatest("SL.UEM.TOTL.NE.ZS"),
      fetchBankRate(),
    ]);

    return NextResponse.json(
      {
        inflation,
        gdp,
        unemployment,
        bankRate,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("uk-macro API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch macro data" },
      { status: 500 }
    );
  }
}
