export default async (req) => {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing API Key" }), { 
      status: 500, headers: { "Content-Type": "application/json" } 
    });
  }

  if (req.method === "POST") {
    const contentType = req.headers.get("content-type") || "";
    
    // 1. Create a new chat session (No JSON body)
    if (!contentType.includes("application/json")) {
      const res = await fetch("https://api.retellai.com/v2/create-chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agent_id: "agent_20fb6a915440360e4472698b77" }),
      });
      
      if (!res.ok) {
        return new Response(await res.text(), { status: res.status });
      }
      return Response.json(await res.json());
    }

    // 2. Send a message to the chat (Has JSON body)
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

      if (!res.ok) {
        return new Response(await res.text(), { status: res.status });
      }
      return Response.json(await res.json());
      
    } catch (e) {
      return new Response(JSON.stringify({ error: "Bad Request" }), { 
        status: 400, headers: { "Content-Type": "application/json" } 
      });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
};

export const config = { path: "/api/create-chat" };
