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
      // @ts-expect-error both mdn and deno have this
      // https://deno.com/deploy/docs/runtime-headers#methods
      // https://developer.mozilla.org/en-US/docs/Web/API/Headers/entries
      ...Object.fromEntries(rest.headers.entries()),
      "X-Forwarded-For": ip,
    },
  });
};
