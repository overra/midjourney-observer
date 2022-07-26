/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import ProfileLoader from "../islands/ProfileLoader.tsx";

export default function Home() {
  return (
    <div class={tw`w-full h-full`}>
      <div
        id="main"
        class={tw`w-full h-full flex bg-cover justify-center items-center`}
        style={{
          backgroundImage: ` linear-gradient(to bottom, rgba(76, 29, 149,0), rgba(76, 29, 149,1)), url(https://media.discordapp.net/attachments/986130712484782091/1001325172118274128/33611c38-9570-4b0b-bdf6-0096f581c9c6_progress_image_77.webp)`,
        }}
      >
        <div
          class={tw`p-8 flex flex-col justify-center items-center max-w-screen-md rounded-lg shadow-2xl`}
          style={{
            backgroundImage:
              "linear-gradient(to bottom left, teal -50%, magenta 150%)",
          }}
        >
          <style>{`html, body { height: 100% }`}</style>
          <title>MidJourney Observer</title>
          <script
            defer
            data-domain="midjourney-observer.deno.dev"
            src="https://plausible.io/js/plausible.js"
          ></script>
          <h1 class={tw`text-6xl text-white mix-blend-overlay`}>
            MidJourney Observer
          </h1>
          <p class={tw`my-6 text-white opacity-90`}>
            Paste your MidJourney Profile URL here to see the breakdown of your
            prompts.
          </p>
          <ProfileLoader />
          <div class={tw`flex flex-row items-center gap-4`}>
            <p class={tw`text-purple-50`}>
              You'll need generated sets of seeded images.
            </p>
            <a
              href="#info"
              class={tw`text-green-200 border-green-200 border-2 px-4 py-2 rounded-md transition-colors duration-200 bg-purple-900 hover:bg-purple-800`}
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
      <div
        id="info"
        class={tw`w-full h-full bg-cover flex flex-row justify-center items-center bg-purple-900`}
      >
        <div class={tw`flex lg:flex-row md:flex-col gap-8`}>
          <div class={tw`rounded-lg shadow-lg overflow-hidden md:hidden`}>
            <img src="/screenshot.webp" class={tw`w-64`} />
          </div>
          <div class={tw`bg-purple-800 p-8 max-w-prose rounded-lg shadow-lg`}>
            <h2 class={tw`text-2xl text-purple-200 pb-4`}>
              What do you mean generated sets of seeded images?
            </h2>

            <p class={tw`text-purple-200 pb-8`}>
              When you use <Code>--seed [number]</Code> with a variety of{" "}
              <Code>--quality</Code> or <Code>--stylize</Code> values, you'll
              get a set of images that you can use to compare how your prompts
              look.
            </p>

            <h2 class={tw`text-2xl text-purple-200 pb-4`}>
              Where do I get my profile URL?
            </h2>
            <ul class={tw`text-purple-50 leading-relaxed pb-4`}>
              <li>
                👉 go to your{" "}
                <a
                  href="https://www.midjourney.com/app/"
                  target="_blank"
                  class={tw`text-green-200 leading-relaxed`}
                >
                  MidJourney feed
                </a>
              </li>
              <li>👉 locate your username at the bottom of a Feed item</li>
              <li>👉 right-click your username and "Copy Link Address".</li>
            </ul>
            <p class={tw`text-white leading-relaxed font-bold`}>
              Now you're ready to{" "}
              <a href="#profile-url" class={tw`text-green-200 leading-relaxed`}>
                paste your profile URL
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <code class={tw`font-mono bg-purple-900 text-xs p-1`}>{children}</code>
  );
}
