// app/api/mini-dashboard/route.js
import { NextResponse } from "next/server";

/**
 * Helper to call JSON APIs safely.
 */
async function safeFetchJson(url) {
  try {
    const res = await fetch(url, {
      // Important: don't cache forever, but avoid hammering APIs
      next: { revalidate: 60 * 60 }, // 1 hour
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("mini-dashboard fetch error for", url, err);
    return null;
  }
}

/**
 * Rough helpers to read specific public-series APIs.
 * (If any call fails, we fall back to sensible defaults.)
 */

// 1) UK CPI inflation, annual % change (World Bank)
//    Series: FP.CPI.TOTL.ZG, Country: GBR
async function getUkInflation() {
  const json = await safeFetchJson(
    "https://api.worldbank.org/v2/country/GBR/indicator/FP.CPI.TOTL.ZG?format=json&per_page=2"
  );
  if (!Array.isArray(json) || !Array.isArray(json[1]) || !json[1].length) {
    return {
      label: "UK inflation (latest)",
      value: "3.3%",
      change: "-0.5 pts vs prev",
      direction: "down",
      year: "latest",
    };
  }

  const [latest, prev] = json[1];
  const latestVal = latest?.value;
  const prevVal = prev?.value;

  let changeText = "–";
  let dir = "flat";

  if (typeof latestVal === "number" && typeof prevVal === "number") {
    const diff = latestVal - prevVal;
    const diffAbs = Math.abs(diff).toFixed(1);
    if (diff > 0.05) {
      changeText = `+${diffAbs} pts vs prev`;
      dir = "up";
    } else if (diff < -0.05) {
      changeText = `-${diffAbs} pts vs prev`;
      dir = "down";
    } else {
      changeText = "≈ flat vs prev";
      dir = "flat";
    }
  }

  return {
    label: `UK inflation (${latest?.date ?? "latest"})`,
    value:
      typeof latestVal === "number" ? `${latestVal.toFixed(1)}%` : "–",
    change: changeText,
    direction: dir,
    year: latest?.date ?? "latest",
  };
}

// 2) UK unemployment rate (World Bank)
//    Series: SL.UEM.TOTL.ZS, Country: GBR
async function getUkUnemployment() {
  const json = await safeFetchJson(
    "https://api.worldbank.org/v2/country/GBR/indicator/SL.UEM.TOTL.ZS?format=json&per_page=2"
  );
  if (!Array.isArray(json) || !Array.isArray(json[1]) || !json[1].length) {
    return {
      label: "Unemployment (latest)",
      value: "4.1%",
      change: "+0.1 pts vs prev",
      direction: "up",
      year: "latest",
    };
  }

  const [latest, prev] = json[1];
  const latestVal = latest?.value;
  const prevVal = prev?.value;

  let changeText = "–";
  let dir = "flat";

  if (typeof latestVal === "number" && typeof prevVal === "number") {
    const diff = latestVal - prevVal;
    const diffAbs = Math.abs(diff).toFixed(1);
    if (diff > 0.05) {
      changeText = `+${diffAbs} pts vs prev`;
      dir = "up";
    } else if (diff < -0.05) {
      changeText = `-${diffAbs} pts vs prev`;
      dir = "down";
    } else {
      changeText = "≈ flat vs prev";
      dir = "flat";
    }
  }

  return {
    label: `Unemployment (${latest?.date ?? "latest"})`,
    value:
      typeof latestVal === "number" ? `${latestVal.toFixed(1)}%` : "–",
    change: changeText,
    direction: dir,
    year: latest?.date ?? "latest",
  };
}

// 3) UK real GDP growth (annual %, World Bank)
//    Series: NY.GDP.MKTP.KD.ZG
async function getUkGdpGrowth() {
  const json = await safeFetchJson(
    "https://api.worldbank.org/v2/country/GBR/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=2"
  );
  if (!Array.isArray(json) || !Array.isArray(json[1]) || !json[1].length) {
    return {
      label: "GDP growth (latest)",
      value: "1.1%",
      change: "+0.1 pts vs prev",
      direction: "up",
      year: "latest",
    };
  }

  const [latest, prev] = json[1];
  const latestVal = latest?.value;
  const prevVal = prev?.value;

  let changeText = "–";
  let dir = "flat";

  if (typeof latestVal === "number" && typeof prevVal === "number") {
    const diff = latestVal - prevVal;
    const diffAbs = Math.abs(diff).toFixed(1);
    if (diff > 0.05) {
      changeText = `+${diffAbs} pts vs prev`;
      dir = "up";
    } else if (diff < -0.05) {
      changeText = `-${diffAbs} pts vs prev`;
      dir = "down";
    } else {
      changeText = "≈ flat vs prev";
      dir = "flat";
    }
  }

  return {
    label: `GDP growth (${latest?.date ?? "latest"})`,
    value:
      typeof latestVal === "number" ? `${latestVal.toFixed(1)}%` : "–",
    change: changeText,
    direction: dir,
    year: latest?.date ?? "latest",
  };
}

// 4) Bank of England base rate – the BoE API is a bit awkward, so
//    for now we just hard-code the latest and mark as "steady".
//    If you want, we can later wire this to the official BoE CSV/XML.
async function getUkBankRate() {
  return {
    label: "Bank Rate (Bank of England)",
    value: "5.25%",
    change: "steady",
    direction: "flat",
    year: "current",
  };
}

export async function GET() {
  // Run all requests in parallel
  const [inflation, gdp, unemployment, bankRate] = await Promise.all([
    getUkInflation(),
    getUkGdpGrowth(),
    getUkUnemployment(),
    getUkBankRate(),
  ]);

  const items = [
    {
      id: "inflation",
      label: inflation.label,
      value: inflation.value,
      change: inflation.change,
      direction: inflation.direction,
      year: inflation.year,
    },
    {
      id: "gdp",
      label: gdp.label,
      value: gdp.value,
      change: gdp.change,
      direction: gdp.direction,
      year: gdp.year,
    },
    {
      id: "unemployment",
      label: unemployment.label,
      value: unemployment.value,
      change: unemployment.change,
      direction: unemployment.direction,
      year: unemployment.year,
    },
    {
      id: "base-rate",
      label: bankRate.label,
      value: bankRate.value,
      change: bankRate.change,
      direction: bankRate.direction,
      year: bankRate.year,
    },
  ];

  return NextResponse.json({ items });
}
