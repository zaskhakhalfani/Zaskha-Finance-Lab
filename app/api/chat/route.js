// app/api/chat/route.js
import { NextResponse } from "next/server";

/**
 * Chat endpoint for the AI Economics Tutor.
 * Uses Groq's API via your GROQ_API_KEY in .env.local
 */
export async function POST(req) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Missing GROQ_API_KEY. Add it to .env.local in the project root and restart `npm run dev`.",
      },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  const { messages } = body || {};
  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "Request body must include an array 'messages'." },
      { status: 400 }
    );
  }

  try {
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          // Use a stable, supported Groq model
          model: "llama-3.1-8b-instant",
          messages,
          temperature: 0.4,
        }),
      }
    );

    const data = await groqRes.json();

    if (!groqRes.ok) {
      console.error("Groq API error:", data);
      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "Upstream Groq API error. Check your key and model.",
        },
        { status: 500 }
      );
    }

    const answer =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Unexpected server error in /api/chat" },
      { status: 500 }
    );
  }
}
