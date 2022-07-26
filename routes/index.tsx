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
          class={tw`p-8  max-w-screen-md rounded-lg shadow-2xl`}
          style={{
            backgroundImage:
              "linear-gradient(to bottom left, teal -50%, magenta 150%)",
          }}
        >
          <style>{`html, body { height: 100% }`}</style>
          <h1 class={tw`text-6xl text-white mix-blend-overlay`}>
            Midjourney Observer
          </h1>
          <p class={tw`my-6 text-white opacity-90`}>
            Paste your Midjourney Profile URL (
            <a href="#info" class={tw`text-green-200`}>
              wut?
            </a>
            ) here to see the breakdown of your prompts.
          </p>
          <ProfileLoader />
        </div>
      </div>
      <div
        id="info"
        class={tw`w-full h-full bg-cover flex flex-row justify-center items-center bg-purple-900`}
      >
        <div class={tw`flex flex-row gap-8`}>
          <img
            src="https://cdn.discordapp.com/attachments/986130712484782091/1001341380615999578/unknown.png"
            class={tw`w-64`}
          />
          <div class={tw`bg-purple-800 p-8 rounded-lg shadow-lg`}>
            <h2 class={tw`text-3xl text-purple-200`}>
              Where do I get my profile URL?
            </h2>
            <ul class={tw`text-purple-50 leading-relaxed py-8`}>
              <li>
                &gt; go to your{" "}
                <a
                  href="https://www.midjourney.com/app/"
                  target="_blank"
                  class={tw`text-green-200 leading-relaxed`}
                >
                  Midjourney feed
                </a>
              </li>
              <li>
                &gt; locate your username at the bottom of an item (pictured
                left)
              </li>
              <li>&gt; right-click your username and "Copy Link Address".</li>
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
