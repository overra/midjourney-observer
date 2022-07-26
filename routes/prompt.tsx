/** @jsx h */
import { h, Fragment } from "preact";
import { tw } from "@twind";
import PromptGenerator from "../islands/PromptGenerator.tsx";
import { Head } from "$fresh/src/runtime/head.ts";

export default function PromptGeneratorPage() {
  return (
    <Fragment>
      <Head>
        <style>{`html, body { height: 100% }`}</style>
        <title>Prompt Generator | MidJourney Observer</title>
        <script
          defer
          data-domain="midjourney.observer"
          src="/js/script.js"
        ></script>
      </Head>

      <div class={tw`h-full bg-gray-900`}>
        <PromptGenerator open />;
      </div>
    </Fragment>
  );
}
