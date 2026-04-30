// Netlify serverless function: /api/generate-report
// Streams Anthropic's response back to the browser using Server-Sent Events.
// Streaming avoids the 30s function timeout by keeping the connection active
// while chunks flow. The client stitches the chunks and parses JSON at the end.

export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = Netlify.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not set in environment" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  try {
    const payload = await request.json();
    const { system, messages, model = "claude-sonnet-4-20250514", max_tokens = 3000 } = payload;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model, max_tokens, system, messages, stream: true }),
    });

    // If Anthropic rejected the request, forward the error body as-is.
    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(errText, {
        status: anthropicRes.status,
        headers: { "content-type": "application/json" },
      });
    }

    // Pipe the SSE body straight through to the client.
    return new Response(anthropicRes.body, {
      status: 200,
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        "connection": "keep-alive",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Function error", detail: String(err) }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
};

export const config = {
  path: "/api/generate-report",
};
