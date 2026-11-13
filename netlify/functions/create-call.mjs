export default async () => {
  const apiKey = process.env.RETELL_API_KEY;
  console.log("KEY STATUS:", apiKey ? "Loaded successfully" : "MISSING!");

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "RETELL_API_KEY is missing." }), { status: 500 });
  }

  // The URL is updated to the v3 endpoint
  const res = await fetch("https://api.retellai.com/v3/create-web-call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ agent_id: "agent_71a4fbab2c00f761ae7054b81b" }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("RETELL API ERROR:", errorText);
    return new Response(JSON.stringify({ error: `Retell API Failed: ${errorText}` }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  // The v3 response contains more fields than just the token.
  // We pass the entire JSON response back to the browser.
  const data = await res.json();
  return Response.json(data);
};

export const config = { path: "/api/create-call" };