import { HandlerContext } from "$fresh/server.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const addr = _ctx.remoteAddr as Deno.NetAddr;
  const req = _req.clone();

  req.headers.set("host", "plausible.io");
  req.headers.set("hostname", "https://plausible.io");
  req.headers.set("X-Forwarded-For", addr.hostname);
  return await fetch(req);
};
