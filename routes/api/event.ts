import { HandlerContext } from "$fresh/server.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const addr = _ctx.remoteAddr as Deno.NetAddr;
  const req = _req.clone();
  console.log(Object.fromEntries(req.headers?.entries()));
  return await fetch("https://plausible.io/api/event", {
    method: "post",
    headers: {
      ...Object.fromEntries(req.headers?.entries()),
      "X-Forwarded-For": addr.hostname,
    },
    body: await _req.body(),
  });
};
