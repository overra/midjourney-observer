import { HandlerContext } from "$fresh/server.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const addr = _ctx.remoteAddr as Deno.NetAddr;

  _req.headers.set("host", "plausible.io");
  _req.headers.set("hostname", "https://plausible.io");
  _req.headers.set("X-Forwarded-For", addr.hostname);
  return await fetch(_req);
};
