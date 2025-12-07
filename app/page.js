// app/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SectionCard from "@/components/SectionCard";

// Fun facts (deduped + shuffled once at load)
const funFacts = (() => {
  const base = [
    "The average £1 coin remains in circulation for about 30 years.",
    "GDP was created in the 1930s to measure economic recovery after the Great Depression.",
    "Some countries have negative interest rates, meaning banks charge you to save money.",
    "China has lifted more than 800 million people out of poverty in the last 40 years.",
    "A country can grow its GDP even if people feel poorer – for example, if prices rise faster than wages.",
    "Switzerland once made a chocolate gold bar you could deposit in banks as real money.",
    "Roughly 1 in 3 UK adults have less than £1,000 in savings for emergencies.",
    "Coca-Cola is sold in every country in the world except two: Cuba and North Korea.",
    "The richest people in history were so wealthy they could buy entire countries — literally.",
    "Hyperinflation in Zimbabwe once made prices double roughly every 24 hours.",
    "Most day traders lose money, while simple index funds quietly grow in the background.",
    "Gold has been used as money for over 3,000 years.",
    "In some cities, you can pay for your taxi ride using recycled plastic bottles.",
    "The amount of global debt is higher than the amount of global wealth.",
    "A £5 note today buys you less than it did 10 years ago — that’s inflation quietly at work.",
    "Supermarket loyalty cards exist mainly to collect spending data, not give discounts.",
    "The stock market has gone up in about 3 out of every 4 years historically.",
    "Japan’s economy was once growing so fast people thought it would surpass the US.",
    "There’s a credit card made of pure gold and diamonds — owners need a personal invite.",
    "The world produces more than $100 trillion worth of goods and services every year.",
    "Most countries have more debt than money.",
    "If you invested in every stock in the world, you would own over 40,000 companies.",
    "There are more mobile phones in the world than bank accounts.",
    "The world’s oceans contain more gold than all gold ever mined, but it’s too spread out to collect.",
    "If you saved every £2 coin you got, you could accidentally save hundreds a year without noticing.",
    "Disney World is so big its economy is larger than some small countries.",
    "Online stores put items ‘low in stock’ to create urgency — even when stock is full.",
    "Salt was once so valuable that Roman soldiers were partly paid with it.",
    "An economist once won a Nobel Prize for studying… people who buy too many coffee mugs.",
    "There are more cryptocurrencies today than the number of fiat currencies.",
    "If you laid every pound coin in the world end-to-end, it would stretch to the moon and back several times.",
    "One country printed a 100 trillion dollar banknote — the highest ever seen.",
    "McDonald’s makes more money from property than it does from food.",
    "In some countries, people used giant shells as money — some were bigger than a person.",
    "The first stock market was established in Amsterdam in 1602.",
    "Over long periods, missing just the 10 best days in the stock market can cut your returns in half.",
    "In Denmark, some trains run late *on purpose* to qualify for government subsidies.",
    "During 2021, global stock markets created more than $20 trillion in new wealth.",
    "If the global economy were a company, its 'revenue' per person would be over $10,000 a year.",
    "In 1970, a movie ticket cost about £1. Today it's around £10 — that’s inflation you can see.",
    "A Monopoly game once accidentally printed real-looking money, causing confusion at a bank.",
    "If you invest £1 a day from age 18, you could retire with more than someone who invests £200 a month starting at 35.",
    "A banana taped to a wall once sold for over $120,000.",
    "The US once printed money with the value of $100,000 on a single note — it was never for the public.",
    "A tiny island called Niue earns money from selling Pokémon coins as legal currency.",
    "The world’s most expensive stock costs over £400,000 *per share* (Berkshire Hathaway).",
    "The number of billionaires in the world has doubled in the last decade.",
    "Pension funds are some of the biggest investors in the world — they quietly own huge parts of major companies.",
    "One airline made over $1 billion in a year just from baggage fees.",
    "If you bought £100 of Bitcoin in 2010, it would be worth millions today.",
    "Some countries invest their oil money into giant 'sovereign wealth funds' that buy stocks, bonds, and real estate worldwide.",
    "Roughly half of adults worldwide have no investments beyond cash or a basic bank account.",
    "Some countries used giant stones as money — one stone was so big it never moved; ownership just changed.",
    "Over long periods, stocks have historically beaten inflation by about 4–7% per year on average.",
    "The first ever ‘credit card’ started as a metal plate people carried in the 1920s.",
    "If you fold a £20 note 4,000 times, it would reach the distance of Mount Everest.",
    "During the 1930s, people bought so many movie tickets that cinemas basically kept the economy alive.",
    "People underestimate their monthly spending by as much as 40%.",
    "In 2006, Blockbuster could have bought Netflix for $50 million. They said no. Netflix is now worth billions.",
    "Studies show people spend more money when using cards because it doesn’t feel like “real money.”",
    "Most of the world’s wealth is owned by less than 1% of the population.",
    "A man once paid 10,000 bitcoins for two pizzas. Today that bitcoin would be worth hundreds of millions.",
    "Some countries print money made from plastic, not paper — they last longer and don’t get soggy.",
    "Amazon once lost $3 billion in a single day — and the next day the stock went up again.",
    "Apple is worth more than the total GDP of most countries.",
    "Some countries earn money by minting special edition coins for tourists.",
    "There are over 2,600 billionaires in the world today.",
    "Index funds were once mocked on Wall Street; now even billionaire investors recommend them.",
    "In some places, you can buy insurance for being late to meetings.",
    "Economists once used the price of Big Macs to compare currencies around the world.",
    "Apple has more cash than most countries have in their national reserves.",
    "One of the world’s richest men, Warren Buffett, still eats McDonald’s breakfast almost every day.",
    "During lockdowns, people spent more money on bread-making machines than on clothes.",
    "The world's most expensive coin sold for over $18 million.",
    "Some countries have had inflation so bad that prices changed multiple times *in one day*.",
    "Inflation of just 3% halves the value of money in about 24 years.",
    "Netflix was nearly bankrupt before streaming became popular.",
    "A digital image of a rock once sold for over £1 million as an NFT.",
    "If the global ultra-rich paid just 1% more in tax, it could raise hundreds of billions a year.",
    "The average billionaire owns more than ten properties worldwide.",
    "There was a time in history when a loaf of bread in Germany cost billions of marks because inflation went wild.",
    "The Great Depression reduced world trade by nearly 66% — people simply stopped buying.",
    "There’s a real ATM in Antarctica for scientists stationed there.",
    "The world’s first recorded financial crisis happened in 1637 because of tulip flowers.",
    "A man once threw away a hard drive containing over £150 million worth of Bitcoin.",
    "At one point, oil prices went below zero — sellers paid buyers to take oil.",
    "Wealth inequality has grown so much that a few dozen people now own more than billions of others combined.",
    "During hyperinflation in Zimbabwe, a loaf of bread cost billions of dollars.",
    "Airports make a large amount of their profit from shops, not flights.",
    "The world’s first stock exchange didn’t allow trading actual shares — only bets on share prices.",
    "More than 90% of the world’s money exists only in digital form.",
    "A chicken in Zimbabwe once cost 14 billion dollars during hyperinflation.",
    "The world’s most expensive burger once sold for over £4,000.",
    "If you invest £200/month at 7% return, you could end up with around £240,000 after 30 years.",
    "Supermarkets place essential items like milk at the back so you walk past everything else.",
    "The average person spends 90,000 hours of their life working — that’s over 10 years non-stop.",
    "A £3 coffee every weekday adds up to over £700 a year.",
    "The world’s smallest country, Vatican City, uses the euro even though it’s not part of the EU.",
    "Starbucks makes more money from people forgetting to use their gift cards than from some menu items.",
    "Over 60% of workers in the world are in the informal economy, with no formal contract or pension.",
    "If you invested £1 a day for 30 years, you could build a six-figure portfolio.",
    "Casinos never have clocks because it encourages people to stay longer and spend more.",
    "Some train companies in Europe intentionally run late to qualify for subsidies.",
    "The UK’s inflation peaked above 20% in the mid-1970s, heavily eroding savings.",
    "The Queen of England once visited the Bank of England’s gold vault, which stores over 400,000 gold bars.",
    "People tend to spend more in stores with brighter lighting.",
    "If you invested £1,000 in Apple in 2002, it would be worth over £300,000 today.",
    "People are more likely to spend money when holding a warm drink.",
    "The amount of global debt is higher than the amount of global wealth.",
    "Japan has more vending machines than many countries have people.",
    "In Japan, interest rates were close to 0% for years, which made saving in cash almost pointless.",
    "The world produces enough food for everyone, yet millions go hungry due to economic inequality.",
    "There are more £50 notes in circulation than people in the UK.",
    "Some countries have had interest rates of 1,000% or more during crises.",
    "People often buy more online when shipping is free — even if the product price is higher.",
    "Airline tickets change prices dozens of times a day using algorithms.",
    "One trader’s mistake at a bank caused a loss of over $6 billion.",
    "Most lottery winners go broke within five years.",
    "Some countries have had inflation so extreme that they stopped using their currency entirely.",
    "There’s a vending machine in Dubai that dispenses gold bars like chocolate.",
    "People buy more comfort foods like ice cream when the economy is weak.",
    "Some theme parks set ticket prices using the same math used in the stock market.",
    "The word 'economics' comes from the Greek 'oikonomikos', meaning 'household management'.",
    "Airlines save millions by removing a single olive from meals served in first class.",
    "A country once banned new homes from having front doors — to increase community interaction.",
    "More than 70% of global stock trades are made by automated algorithms.",
    "If you invested in the world stock market instead of just your home country, you’d own thousands of companies at once.",
    "Some countries run out of coins because people collect them as souvenirs.",
    "The US stock market alone makes up about half of the total value of all stocks in the world.",
    "Cows in Switzerland are legally required to have a window with a view on their barns. Yes, economics includes cows.",
    "In 2008, Iceland’s banking collapse was so bad that McDonald’s left the country completely.",
    "A man once gained $25 billion in a single day due to a stock price jump.",
    "Sweden is so cashless that many shops no longer accept physical money at all.",
    "Warren Buffett earns millions every day in interest alone.",
  ];

  const deduped = Array.from(new Set(base));

  // Shuffle once (Fisher–Yates)
  for (let i = deduped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deduped[i], deduped[j]] = [deduped[j], deduped[i]];
  }

  return deduped;
})();

function ChartHero() {
  return (
    <svg
      viewBox="0 0 600 400"
      className="w-full max-w-md mx-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for line */}
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Soft glow just around the line */}
        <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="4"
            floodColor="#22c55e"
            floodOpacity="0.4"
          />
        </filter>
      </defs>

      <style>
        {`
          .grid-line {
            stroke: #1e293b;
            stroke-width: 0.6;
            opacity: 0.18;
          }

          .chart-line {
            fill: none;
            stroke: url(#lineGrad);
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 520;
            stroke-dashoffset: 520;
            animation: draw 2.2s ease-out forwards;
          }

          .point {
            fill: #22c55e;
            opacity: 0;
            animation: pulse 2s ease-out infinite;
          }

          .point-1 { animation-delay: 0.4s; }
          .point-2 { animation-delay: 0.8s; }
          .point-3 { animation-delay: 1.2s; }
          .point-4 { animation-delay: 1.6s; }

          @keyframes draw {
            to { stroke-dashoffset: 0; }
          }

          @keyframes pulse {
            0%   { opacity: 0; r: 2; }
            40%  { opacity: 1; r: 5; }
            100% { opacity: 0; r: 8; }
          }
        `}
      </style>

      <g transform="translate(50,40)">
        {/* Grid (no box, just floating lines) */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 90}
            y1={0}
            x2={i * 90}
            y2={300}
            className="grid-line"
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * 60}
            x2={450}
            y2={i * 60}
            className="grid-line"
          />
        ))}

        {/* Rising line with a soft glow */}
        <path
          className="chart-line"
          filter="url(#lineGlow)"
          d="
            M 0 250
            C 60 240, 90 210, 140 220
            S 210 200, 250 180
            S 320 140, 360 120
            S 410 80, 450 60
          "
        />

        {/* Pulsing data points */}
        <circle className="point point-1" cx="90" cy="215" r="4" />
        <circle className="point point-2" cx="210" cy="190" r="4" />
        <circle className="point point-3" cx="320" cy="145" r="4" />
        <circle className="point point-4" cx="450" cy="60" r="4" />
      </g>
    </svg>
  );
}

export default function HomePage() {
  const [factIndex, setFactIndex] = useState(() =>
    Math.floor(Math.random() * funFacts.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const currentFact = funFacts[factIndex];

  return (
    <div className="space-y-8">
      {/* Top logo/header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">
            Zaskha
          </span>
          <span className="text-xl sm:text-2xl font-light text-slate-200">
            Finance Lab
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3v18h18M7 14l3-3 4 4 4-5"
            />
          </svg>
        </div>
        <span className="hidden sm:inline text-[11px] text-slate-400">
          Learn the world economy. Apply it to your real-life money.
        </span>
      </header>

      {/* Hero: text + animated chart */}
      <section className="md:grid md:grid-cols-2 md:gap-10 md:items-center md:space-y-0 space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Understand inflation, rates, and investing —
            <br />
            <span className="text-emerald-400">
              then use them to grow your real money.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl">
            Zaskha Finance Lab helps you understand inflation, interest rates,
            and investing – then shows how they affect your income, savings, and
            future wealth.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/learn"
              className="px-4 py-2.5 rounded-full bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 transition"
            >
              Start learning
            </Link>
            <Link
              href="/portfolio"
              className="px-4 py-2.5 rounded-full border border-slate-600 text-sm hover:bg-slate-900 transition"
            >
              Try the portfolio simulator
            </Link>
          </div>
        </div>

        <div className="hidden md:block">
          <ChartHero />
        </div>
      </section>

      {/* Quick-start chooser */}
      <section className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-5">
        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
          Start in 10 seconds
        </p>
        <p className="mt-1 text-sm text-slate-100">What do you want to do today?</p>

        <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
          <Link
            href="/learn"
            className="group rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-3 hover:border-emerald-500/70 hover:bg-slate-900 transition"
          >
            <p className="font-semibold text-slate-100 flex items-center gap-2">
              <span>📚</span>
              <span>Understand the basics</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Get simple explanations of inflation, interest rates, GDP and
              investing. Ask the AI tutor follow-up questions.
            </p>
            <p className="mt-2 text-[11px] text-emerald-400 opacity-0 group-hover:opacity-100 transition">
              Open the AI Economics Tutor →
            </p>
          </Link>

          <Link
            href="/portfolio"
            className="group rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-3 hover:border-emerald-500/70 hover:bg-slate-900 transition"
          >
            <p className="font-semibold text-slate-100 flex items-center gap-2">
              <span>📈</span>
              <span>Plan your investments</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Play with different mixes of stocks, bonds, cash and crypto and
              see how risk and returns change.
            </p>
            <p className="mt-2 text-[11px] text-emerald-400 opacity-0 group-hover:opacity-100 transition">
              Try the portfolio builder →
            </p>
          </Link>

          <Link
            href="/inflation"
            className="group rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-3 hover:border-emerald-500/70 hover:bg-slate-900 transition"
          >
            <p className="font-semibold text-slate-100 flex items-center gap-2">
              <span>🔥</span>
              <span>See inflation’s damage</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Estimate how much rising prices could erode the value of your
              savings over time – and why investing matters.
            </p>
            <p className="mt-2 text-[11px] text-emerald-400 opacity-0 group-hover:opacity-100 transition">
              Use the inflation calculator →
            </p>
          </Link>
        </div>
      </section>

      {/* Rotating fun fact */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
        <p className="text-xs font-semibold text-emerald-400 mb-1">
          🌍 Did you know?
        </p>
        <p className="text-[13px]" aria-live="polite">
          {currentFact}
        </p>
        <p className="mt-1 text-[10px] text-slate-500">
          New fact every few seconds – all about economics, money and inflation.
        </p>
      </section>

      {/* Three tools */}
      <section className="grid gap-4 md:grid-cols-3">
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
      </section>
    </div>
  );
}
