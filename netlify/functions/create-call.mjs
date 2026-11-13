export default async () => {
  // 1. Check if the key is actually loaded
  const apiKey = process.env.RETELL_API_KEY;
  console.log("KEY STATUS:", apiKey ? "Loaded successfully" : "MISSING!");

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "RETELL_API_KEY is missing in Netlify Environment Variables." }), { status: 500 });
  }

  // 2. Make the request to Retell
  const res = await fetch("https://api.retellai.com/v2/create-web-call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ agent_id: "agent_71a4fbab2c00f761ae7054b81b" }),
  });

  // 3. If Retell fails, send the exact error back to the browser
  if (!res.ok) {
    const errorText = await res.text();
    console.error("RETELL API ERROR:", errorText);
    return new Response(JSON.stringify({ error: `Retell API Failed: ${errorText}` }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 4. Success
  const { access_token } = await res.json();
  return Response.json({ access_token });
};

export const config = { path: "/api/create-call" };