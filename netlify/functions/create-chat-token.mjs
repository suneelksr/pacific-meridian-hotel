export default async (req) => {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ error: "Missing API Key" }), { status: 500 });

  // If it's a POST with no body, create a new chat session
  if (req.method === "POST" && !req.body) {
    const res = await fetch("https://api.retellai.com/v2/create-chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agent_id: "agent_20fb6a915440360e4472698b77" }),
    });
    if (!res.ok) return new Response(await res.text(), { status: 502 });
    return Response.json(await res.json());
  }

  // If it has a body, it's sending a message
  try {
    const body = await req.json();
    const res = await fetch("https://api.retellai.com/v2/create-chat-completion", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: body.chat_id,
        content: body.content
      }),
    });
    if (!res.ok) return new Response(await res.text(), { status: 502 });
    return Response.json(await res.json());
  } catch (e) {
    return new Response("Bad Request", { status: 400 });
  }
};

export const config = { path: "/api/create-chat" };
