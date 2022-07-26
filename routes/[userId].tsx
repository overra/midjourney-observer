/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import type { Post } from "../utils/types.ts";
import { getPromptParams } from "../utils/get-prompt-params.ts";
import { Layout } from "../components/Layout.tsx";
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
type Params = {
  quality: string;
  stylize: string;
  seed: string;
  q: string;
  s: string;
};

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
        // return a trimmed down payload
        if (!post.image_paths) {
          console.log(`No image paths for post: ${post.id}`);
          return;
        }
        const params = getPromptParams(post.full_command) as Params;
        return post.image_paths.map((image, index) => ({
          image,
          index,
          prompt: post.event.textPrompt.join(" + "),
          seed: params.seed,
          quality: params.quality || params.q || "1",
          stylize: params.stylize || params.s || "2500",
        }));
      })
      .flat() // flatten the array of arrays
      .reduce((acc, post) => {
        if (!post || !post.seed) {
          return acc;
        }
        // group posts by prompt + quality + index
        const key = `${post.prompt} | Quality: ${post.quality ?? 1} | Seed:  ${
          post.seed ?? "unknown"
        }`;

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
  const groups = Object.entries(props.data.posts);
  return (
    <Layout title={`${props.data.username}'s sets | MidJourney Observer`}>
      <div class={tw`bg-gray-900 min-h-full`}>
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
          {groups.length === 0 ? (
            <div class={tw`text-center p-8 text-3xl text-blue-100`}>
              Bummer, I couldn't find any recently generated images with a{" "}
              <code class={tw`font-mono bg-purple-900 text-2xl p-1`}>
                --seed
              </code>
              . Try the <a href="/prompt">Prompt Generator</a>
            </div>
          ) : null}
          {groups.map(([prompt, samples]) => (
            <div class={tw`flex flex-col border-t-teal-300`}>
              <h2
                class={tw`text-base sm:text-xl px-8 py-4 text-green-400`}
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
                    class={tw`p-2 flex flex-col `}
                    style={{ flexBasis: "max(320px, calc(25% - 32px))" }}
                  >
                    <h3 class={tw`text-purple-500 text-xs uppercase font-bold`}>
                      {sampleNames[index]}
                    </h3>
                    <div class={tw`grid grid-cols-4 justify-center pt-4 gap-4`}>
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
                            <img
                              loading="lazy"
                              class={tw`w-16 shadow-lg`}
                              src={image.image}
                              width={64}
                              height={64}
                              alt={prompt}
                            />
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
    </Layout>
  );
}
