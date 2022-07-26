import { HandlerContext } from "$fresh/server.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const addr = _ctx.remoteAddr as Deno.NetAddr;

  return await fetch("https://plausible.io/api/event", {
    method: "post",
    headers: {
      "User-Agent": _req.headers.get("User-Agent") || "Missing User-Agent",
      "X-Forwarded-For": addr.hostname,
      "Content-Type": "application/json",
    },
    body: await _req.text(),
  });
};
