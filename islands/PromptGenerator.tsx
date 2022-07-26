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
      <summary class={tw`text-2xl text-green-300 p-4 cursor-pointer`}>
        Prompt Generator
      </summary>
      <form
        method="get"
        action="/"
        target="_blank"
        onSubmit={handleSubmit}
        class={tw`p-8 bg-green-900 text-green-100 flex flex-col `}
      >
        <div class={tw`flex flex-row items-center pb-4`}>
          <label for="prompt" class={tw`pr-4 text-lg text-green-200 font-bold`}>
            Prompt
          </label>
          <input
            id="prompt"
            name="prompt"
            type="text"
            value={state.prompt}
            class={tw`p-2 text-gray-800 bg-white bg-blend-overlay rounded-lg shadow-2xl w-full`}
            placeholder="e.g. a cat made of cheese"
            onChange={handleChange}
          />
          <button
            type="submit"
            class={tw`ml-4 text-green-200 border-green-200 border-2 px-4 py-2 rounded-md transition-colors duration-200 bg-purple-900 hover:bg-purple-800`}
          >
            Generate
          </button>
        </div>
        <div class={tw`flex lg:flex-row md:flex-col sm:flex-col`}>
          <div
            class={tw`flex flex-col gap-4 mr-4 pr-8 lg:border-r-2 border-green-800 lg:w-1/3 sm:w-full`}
          >
            <fieldset>
              <legend class={tw`text-lg text-green-200 font-bold`}>
                Quality
              </legend>
              <div class={tw`text-sm flex flex-row flex-wrap `}>
                <div class={tw`w-1/3`}>
                  <input
                    id="quality-low"
                    name="quality"
                    type="checkbox"
                    value="0.25"
                    checked={state.quality.includes("0.25")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="quality-low">
                    Low (0.25x)
                  </label>
                </div>
                <div class={tw`w-1/3`}>
                  <input
                    id="quality-medium"
                    name="quality"
                    type="checkbox"
                    value="0.5"
                    checked={state.quality.includes("0.5")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="quality-medium">
                    Medium (0.5x)
                  </label>
                </div>
                <div class={tw`w-1/3`}>
                  <input
                    id="quality-normal"
                    name="quality"
                    type="checkbox"
                    value="1"
                    checked={state.quality.includes("1")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="quality-normal">
                    Normal (1x)
                  </label>
                </div>
                <div class={tw`w-1/3`}>
                  <input
                    id="quality-high"
                    name="quality"
                    type="checkbox"
                    value="2"
                    checked={state.quality.includes("2")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="quality-high">
                    High (2x) <span class={tw`text-yellow-300`}>$$</span>
                  </label>
                </div>
                <div class={tw`w-1/3`}>
                  <input
                    id="quality-ultra"
                    name="quality"
                    type="checkbox"
                    value="5"
                    checked={state.quality.includes("5")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="quality-ultra">
                    Ultra (5x) <span class={tw`text-yellow-300`}>$$$$$</span>
                  </label>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend class={tw`text-lg text-green-200 font-bold`}>
                Stylize
              </legend>
              <div class={tw`grid-cols-3 grid-rows-3 grid text-sm`}>
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
                    None (625)
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
                    Low (1250)
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
                    Medium (2500)
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
                    High (5000)
                  </label>
                </div>
                <div>
                  <input
                    id="stylize-ultra"
                    name="stylize"
                    type="checkbox"
                    value="10000"
                    checked={state.stylize.includes("10000")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="stylize-ultra">
                    Ultra (10000)
                  </label>
                </div>
                <div>
                  <input
                    id="stylize-best"
                    name="stylize"
                    type="checkbox"
                    value="20000"
                    checked={state.stylize.includes("20000")}
                    onChange={handleChange}
                  />
                  <label class={tw`pl-2`} for="stylize-best">
                    "Best" (20000)
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
                    Wild (60000)
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
            <div>
              <div class={tw`w-full text-3xl`}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(totalAmount)}{" "}
                for {ms(totalTime * 60000, { long: true })}
              </div>
              <span class={tw`text-sm`}>
                Incremental Billing ($4 for 60 GPU minutes)
              </span>
            </div>
          </div>
          <div class={tw`flex flex-col gap-4`}>
            {batch(output, 10).map((item) => (
              <div
                class={tw`rounded-md bg-green-800 w-full p-4 whitespace-pre`}
              >
                {item.join("")}
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
