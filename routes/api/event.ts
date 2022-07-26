import { HandlerContext } from "$fresh/server.ts";

export const handler = (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const { url, ...rest } = _req;
  return fetch("https://plausible.io/api/event", { ...rest, method: "post" });
};
