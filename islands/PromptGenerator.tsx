/** @jsx h */
import { h } from "preact";
import { useState, useLayoutEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { ms } from "https://raw.githubusercontent.com/denolib/ms/master/ms.ts";

export default function PromptGenerator({ open = false }: { open?: boolean }) {
  const [state, setState] = useState<{
    prompt: string;
    quality: string[];
    stylize: string[];
    seed: string;
  }>({
    prompt: "",
    quality: ["0.25", "1"],
    stylize: ["625", "2500"],
    seed: Math.floor(Math.random() * 10000).toString(),
  });

  function handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    setState({
      quality: formData.getAll("quality") as string[],
      stylize: formData.getAll("stylize") as string[],
      prompt: formData.get("prompt") as string,
      seed: formData.get("seed") as string,
    });
  }

  const totalCommands = state.quality.length * state.stylize.length;
  const totalTime = state.quality.reduce(
    (total, quality) =>
      total + parseFloat(quality as string) * state.stylize.length,
    0
  );
  const totalAmount =
    (4 / 60) * // $4/60 GPU minutes
    totalTime;

  const output = [];
  if (state.prompt) {
    for (const quality of state.quality) {
      for (const stylize of state.stylize) {
        output.push(
          `/imagine prompt: ${state.prompt} --seed ${state.seed} --quality ${quality} --stylize ${stylize}\n`
        );
      }
    }
  } else {
    output.push(["☝️ Let your imagination flow..."]);
  }

  function handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const name = input.name as keyof typeof state;
    const value = input.value;
    const currentState = state[name];
    if (Array.isArray(currentState)) {
      setState((state) => ({
        ...state,
        [name]: currentState.includes(value)
          ? currentState.filter((v) => v !== value)
          : [...currentState, value],
      }));
    } else {
      setState((state) => ({ ...state, [name]: value }));
    }
  }

  return (
    <details open={open}>
      <summary
        class={tw`text-lg sm:text-2xl text-green-300 py-2 px-4 sm:p-4 cursor-pointer`}
      >
        Prompt Generator
      </summary>
      <form
        method="get"
        action="/"
        target="_blank"
        onSubmit={handleSubmit}
        class={tw`p-4 sm:p-8 bg-green-900 text-green-100 flex flex-col `}
      >
        <div
          class={tw`flex sm:flex-row flex-col sm:gap-0 gap-4 sm:items-center pb-4`}
        >
          <label for="prompt" class={tw`pr-4 text-lg text-green-200 font-bold`}>
            Prompt
          </label>
          <input
            id="prompt"
            name="prompt"
            type="text"
            value={state.prompt}
            class={tw`p-2 text-gray-800 bg-white bg-blend-overlay rounded-lg shadow-2xl flex-grow`}
            placeholder="e.g. a cat made of cheese"
            onChange={handleChange}
          />
          <button
            type="submit"
            class={tw`ml-4 hidden sm:block  text-green-200 border-green-200 border-2 px-4 py-2 rounded-md transition-colors duration-200 bg-purple-900 hover:bg-purple-800`}
          >
            Generate Commands
          </button>
        </div>
        <div class={tw`flex lg:flex-row flex-col`}>
          <div
            class={tw`flex sm:flex-col flex-col-reverse gap-4 mr-0 pr-0 lg:mr-4 lg:pr-8 lg:border-r-2 border-dotted border-green-800 lg:w-1/3 sm:w-full`}
          >
            <button
              type="submit"
              class={tw`block sm:hidden  text-green-200 border-green-200 border-2 px-4 py-2 rounded-md transition-colors duration-200 bg-purple-900 hover:bg-purple-800`}
            >
              Generate Commands
            </button>

            <fieldset>
              <legend class={tw`text-lg text-green-200 font-bold pb-2`}>
                Quality
              </legend>
              <div
                class={tw`flex flex-wrap sm:grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-2 lg:grid-rows-2 xl:grid-cols-3 xl:grid-rows-3 text-sm gap-2`}
              >
                <div>
                  <input
                    id="quality-low"
                    name="quality"
                    type="checkbox"
                    value="0.25"
                    checked={state.quality.includes("0.25")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="quality-low">
                    Low 0.25
                  </label>
                </div>
                <div>
                  <input
                    id="quality-medium"
                    name="quality"
                    type="checkbox"
                    value="0.5"
                    checked={state.quality.includes("0.5")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="quality-medium">
                    Med 0.5
                  </label>
                </div>
                <div>
                  <input
                    id="quality-normal"
                    name="quality"
                    type="checkbox"
                    value="1"
                    checked={state.quality.includes("1")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="quality-normal">
                    Base 1
                  </label>
                </div>
                <div>
                  <input
                    id="quality-high"
                    name="quality"
                    type="checkbox"
                    value="2"
                    checked={state.quality.includes("2")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="quality-high">
                    More 2 <span class={tw`text-yellow-300`}>$$</span>
                  </label>
                </div>
                <div>
                  <input
                    id="quality-ultra"
                    name="quality"
                    type="checkbox"
                    value="5"
                    checked={state.quality.includes("5")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="quality-ultra">
                    Exp 5 <span class={tw`text-yellow-300`}>$$$$$</span>
                  </label>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend class={tw`text-lg text-green-200 font-bold pb-2`}>
                Stylize
              </legend>
              <div
                class={tw`flex flex-wrap sm:grid  sm:grid-cols-4 md:grid-cols-5  lg:grid-cols-2 lg:grid-rows-2 xl:grid-cols-3 xl:grid-rows-3 text-sm gap-2`}
              >
                <div>
                  <input
                    id="stylize-none"
                    name="stylize"
                    type="checkbox"
                    value="625"
                    checked={state.stylize.includes("625")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="stylize-none">
                    None 625
                  </label>
                </div>
                <div>
                  <input
                    id="stylize-low"
                    name="stylize"
                    type="checkbox"
                    value="1250"
                    checked={state.stylize.includes("1250")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="stylize-low">
                    Low 1250
                  </label>
                </div>
                <div>
                  <input
                    id="stylize-medium"
                    name="stylize"
                    type="checkbox"
                    value="2500"
                    checked={state.stylize.includes("2500")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="stylize-medium">
                    Medium 2500
                  </label>
                </div>
                <div>
                  <input
                    id="stylize-high"
                    name="stylize"
                    type="checkbox"
                    value="5000"
                    checked={state.stylize.includes("5000")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="stylize-high">
                    High 5000
                  </label>
                </div>
                <div>
                  <input
                    id="stylize-very-high"
                    name="stylize"
                    type="checkbox"
                    value="10000"
                    checked={state.stylize.includes("10000")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="stylize-very-high">
                    Higher 10000
                  </label>
                </div>
                <div>
                  <input
                    id="stylize-ultra"
                    name="stylize"
                    type="checkbox"
                    value="20000"
                    checked={state.stylize.includes("20000")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="stylize-ultra">
                    Ultra 20000
                  </label>
                </div>
                <div>
                  <input
                    id="stylize-wild"
                    name="stylize"
                    type="checkbox"
                    value="60000"
                    checked={state.stylize.includes("60000")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="stylize-wild">
                    Wild 60000
                  </label>
                </div>
              </div>
            </fieldset>
            <div class={tw`flex items-center`}>
              <label
                for="seed"
                class={tw`pr-4 text-lg text-green-200 font-bold`}
              >
                Seed
              </label>
              <input
                id="seed"
                name="seed"
                type="number"
                class={tw`p-2 text-gray-800 bg-white bg-blend-overlay rounded-lg shadow-2xl w-full`}
                value={state.seed}
              />
              <button
                type="button"
                onClick={() =>
                  setState((state) => ({
                    ...state,
                    seed: Math.floor(Math.random() * 100000).toString(),
                  }))
                }
                class={tw`ml-4 text-green-200 border-green-200 border-2 px-4 py-2 rounded-md transition-colors duration-200 bg-purple-900 hover:bg-purple-800`}
              >
                Random
              </button>
            </div>
            <div
              class={tw`order-first sm:order-last rounded-lg shadow-md border-green-800 border-dotted border-2 bg-green-900 p-4`}
            >
              <div class={tw`w-full text-lg leading-relaxed text-green-200`}>
                On metered MidJourney usage, this will cost approximately{" "}
                <strong>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalAmount)}
                </strong>{" "}
                for <strong>{ms(totalTime * 60000, { long: true })}</strong> of
                GPU time
              </div>
              <span class={tw`text-xs text-green-300`}>
                Based on Incremental Billing ($4 for 60 GPU minutes)
              </span>
            </div>
          </div>
          <div class={tw`flex flex-col gap-4 lg:pt-0 pt-4`}>
            {batch(output, 10).map((item) => (
              <div>
                <div
                  class={tw`rounded-md bg-green-800 w-full p-4 whitespace-pre`}
                >
                  {item.join("")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </details>
  );
}

// batch items in an array by n elements
function batch<T>(array: T[], n: number): T[][] {
  return array.reduce((acc, item, i) => {
    const index = Math.floor(i / n);
    if (!acc[index]) {
      acc[index] = [];
    }
    acc[index].push(item);
    return acc;
  }, [] as T[][]);
}
