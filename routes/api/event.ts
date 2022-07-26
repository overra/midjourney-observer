import { HandlerContext } from "$fresh/server.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const addr = _ctx.remoteAddr as Deno.NetAddr;
  const ip = addr.hostname;
  const { url, ...rest } = _req;

  return fetch("https://plausible.io/api/event", {
    ...rest,
    method: "post",
    body: await _req.text(),
    headers: {
      ...rest.headers,
      "X-Forwarded-For": ip,
    },
  });
};
