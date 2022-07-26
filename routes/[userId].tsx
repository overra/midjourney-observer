/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import type { Post } from "../utils/types.ts";
import { getPromptParams } from "../utils/get-prompt-params.ts";
import { tw } from "@twind";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

type Feed = {
  username: string;
  posts: Record<
    string,
    {
      image: string;
      stylize: string;
    }[][]
  >;
};

type FeedPost = {
  images: string[];
  prompt: string;
  quality?: number;
  seed?: number;
  stylize?: number;
};

type FeedImage = {
  index: number;
  image: string;
  prompt: string;
  quality?: number;
  seed?: number;
  stylize?: number;
};

type Params = { quality: string; stylize: string; seed: string };

export const handler: Handlers<Feed | null> = {
  async GET(_, ctx) {
    const { userId } = ctx.params;
    const params = new URLSearchParams({
      amount: "50",
      jobType: "yfcc_diffusion,cc12m_diffusion,latent_diffusion", // yfcc_upsample for upscales
      orderBy: "new",
      jobStatus: "completed",
      dedupe: "true",
      refreshApi: "0",
      userId,
    });

    const fetchUrl = `https://www.midjourney.com/api/app/recent-jobs/?${params.toString()}`;
    const response = await fetch(fetchUrl, {
      headers: {
        Cookie: Deno.env.get("MIDJOURNEY_COOKIE") || "",
      },
    });

    if (response.status !== 200) {
      console.log(`Error fetching feed: ${response.status}`);
      console.log(await response.text());
      return ctx.render(null);
    }

    const json: Post[] = await response.json();
    const posts = json
      .map((post) => {
        // return an array of slim image payloads
        return post.image_paths.map((image, index) => ({
          image,
          index,
          prompt: post.event.textPrompt.join(" + "),
          ...(getPromptParams(post.full_command) as Params),
        }));
      })
      .flat() // flatten the array of arrays
      .reduce((acc, post) => {
        // group posts by prompt + quality + index
        const key = `${post.prompt} | Quality: ${post.quality ?? 1} | Seed:  ${
          post.seed ?? "unknown"
        }`;
        if (!post.seed) {
          return acc;
        }

        if (!acc[key]) {
          acc[key] = [];
        }
        if (!acc[key][post.index]) {
          acc[key][post.index] = [];
        }
        acc[key][post.index].push({
          image: post.image,
          stylize: post.stylize ?? "2500",
        });
        return acc;
      }, {} as Record<string, { image: string; stylize: string }[][]>);

    const results: Feed = {
      username: json[0].username,
      posts,
    };
    return ctx.render(results);
  },
};

export default function Feed(props: PageProps<Feed | null>) {
  if (props.data === null) {
    return (
      <div>
        No user found, <a href={`?${Date.now()}`}>refresh</a>?
      </div>
    );
  }
  const sampleNames = ["Top Left", "Top Right", "Bottom Left", "Bottom Right"];
  return (
    <div class={tw`bg-gray-900`}>
      <title>{props.data.username}'s prompt breakdown</title>
      <script
        defer
        data-domain="midjourney-observer.deno.dev"
        src="https://plausible.io/js/plausible.js"
      ></script>
      <h1
        class={tw`p-8 text-2xl text-purple-400`}
        style={{
          backgroundImage:
            "linear-gradient(to bottom left, rgba(76, 29, 149,0), rgba(76, 29, 149,1) 200%)",
        }}
      >
        {props.data.username}'s prompt breakdown
      </h1>
      <div class={tw`flex flex-col`}>
        {Object.entries(props.data.posts).map(([prompt, samples]) => (
          <div class={tw`flex flex-col border-t-teal-300`}>
            <h2
              class={tw`text-xl px-8 py-4 text-green-400`}
              style={{
                backgroundImage:
                  "linear-gradient(to  left, rgba(52, 211, 153,0), rgba(52, 211, 153,1) 300%)",
              }}
            >
              {prompt}
            </h2>
            <div
              class={tw`flex flex-row flex-wrap justify-evenly text-purple-300 bg-black pt-4 pb-16`}
            >
              {samples.map((sample, index) => (
                <div
                  class={tw`p-2 flex flex-col items-center `}
                  style={{ flexBasis: "max(320px, calc(25% - 32px))" }}
                >
                  <h3 class={tw`text-purple-200 text-lg font-bold`}>
                    {sampleNames[index]}
                  </h3>
                  <div
                    class={tw`flex flex-row flex-wrap justify-center pt-4 gap-4`}
                  >
                    {sample
                      .sort((a, b) =>
                        parseInt(a.stylize) > parseInt(b.stylize)
                          ? 1
                          : parseInt(a.stylize) < parseInt(b.stylize)
                          ? -1
                          : 0
                      )
                      .map((image) => (
                        <div
                          class={tw`flex flex-col justify-between items-center`}
                        >
                          <img class={tw`w-16 shadow-lg`} src={image.image} />
                          <div class={tw`text-xs text-green-200 pt-2`}>
                            {image.stylize}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
