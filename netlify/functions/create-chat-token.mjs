export default async (req) => {
  try {
    const apiKey = process.env.RETELL_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing API Key" }), { status: 500 });
    }

    if (req.method === "POST" && !req.body) {
      // Create Chat
      const res = await fetch("https://api.retellai.com/v2/create-chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agent_id: "agent_20fb6a915440360e4472698b77" }),
      });
      
      if (!res.ok) {
        const errText = await res.text();
        console.error("RETELL CREATE CHAT ERROR:", errText);
        return new Response(errText, { status: 502 });
      }
      return Response.json(await res.json());
    }

    if (req.method === "POST" && req.body) {
      // Send Message
      const body = JSON.parse(req.body);
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
        const errText = await res.text();
        console.error("RETELL SEND MESSAGE ERROR:", errText);
        return new Response(errText, { status: 502 });
      }
      return Response.json(await res.json());
    }

    return new Response("Method Not Allowed", { status: 405 });

  } catch (error) {
    console.error("CATCH BLOCK ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config = { path: "/api/create-chat" };
