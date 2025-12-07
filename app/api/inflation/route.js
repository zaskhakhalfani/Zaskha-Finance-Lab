import { NextResponse } from "next/server";

const ALLOWED_COUNTRIES = ["GBR", "USA", "IDN", "JPN", "EUU"];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const rawCountry = (searchParams.get("country") || "GBR").toUpperCase();
    const country = ALLOWED_COUNTRIES.includes(rawCountry) ? rawCountry : "GBR";

    const url = `https://api.worldbank.org/v2/country/${country}/indicator/FP.CPI.TOTL.ZG?format=json&per_page=20`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch inflation data");

    const json = await res.json();
    const raw = json[1] || [];

    const series = raw
      .filter((d) => d.value !== null)
      .slice(0, 15)
      .map((d) => ({
        year: d.date,
        value: d.value,
      }))
      .reverse();

    return NextResponse.json({ country, series });
  } catch (err) {
    console.error("Inflation route error:", err);
    return NextResponse.json(
      { error: "Unable to load inflation data" },
      { status: 500 }
    );
  }
}
