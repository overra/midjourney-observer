/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Layout } from "../components/Layout.tsx";
import PromptGenerator from "../islands/PromptGenerator.tsx";
import { Head } from "$fresh/src/runtime/head.ts";

export default function PromptGeneratorPage() {
  return (
    <Layout title="Prompt Generator | MidJourney Observer">
      <PromptGenerator open />;
    </Layout>
  );
}
