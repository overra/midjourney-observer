import { HandlerContext } from "$fresh/server.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const addr = _ctx.remoteAddr as Deno.NetAddr;
  const req = _req.clone();

  return await fetch(req, {
    headers: {
      host: "plausible.io",
      hostname: "https://plausible.io",
      "X-Forwarded-For": addr.hostname,
    },
  });
};
