// Netlify Function: POST /api/create-call
// Set RETELL_API_KEY in Netlify > Site settings > Environment variables (never put it in index.html).

export default async () => {
  const res = await fetch("https://api.retellai.com/v2/create-web-call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ agent_id: "agent_71a4fbab2c00f761ae7054b81b" }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: await res.text() }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { access_token } = await res.json();
  return Response.json({ access_token });
};

export const config = { path: "/api/create-call" };
