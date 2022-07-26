/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import PromptGenerator from "../islands/PromptGenerator.tsx";

export default function PromptGeneratorPage() {
  return (
    <div class={tw`h-full bg-gray-900`}>
      <style>{`html, body { height: 100% }`}</style>
      <title>Prompt Generator | MidJourney Observer</title>
      <PromptGenerator open />;
    </div>
  );
}
