export default async (req) => {
  try {
    const apiKey = process.env.RETELL_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing RETELL_API_KEY" }), { 
        status: 500, headers: { "Content-Type": "application/json" } 
      });
    }

    if (req.method === "POST") {
      const contentType = req.headers.get("content-type") || "";
      
      // 1. Create Chat
      if (!contentType.includes("application/json")) {
        const res = await fetch("https://api.retellai.com/v2/create-chat", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ agent_id: "agent_20fb6a915440360e4472698b77" }),
        });
        
        const text = await res.text();
        if (!res.ok) throw new Error(`Retell Create Error: ${res.status} - ${text}`);
        return new Response(text, { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 2. Send Message
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

      const text = await res.text();
      if (!res.ok) throw new Error(`Retell Message Error: ${res.status} - ${text}`);
      
      return new Response(text, { status: 200, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });

  } catch (error) {
    // This will catch ANY crash and send it to the browser as JSON
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
};
