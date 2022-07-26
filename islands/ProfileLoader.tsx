/** @jsx h */
import { h } from "preact";
import { useState, useLayoutEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

export default function ProfileLoader() {
  const [state, setState] = useState<{ url: string; userId: string | null }>({
    url: "",
    userId: null,
  });
  const { url, userId } = state;

  function handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const url = input.value;
    if (url.startsWith("https://www.midjourney.com/app/users/")) {
      const userId = url.split("/").slice(-2, -1).pop();
      if (userId && /\d+/.test(userId)) {
        setState(() => ({ url, userId }));
        return;
      }
    }
    setState((state) => ({ ...state, url }));
  }

  useLayoutEffect(() => {
    if (userId) {
      window.location.href = `/${userId}`;
    }
  }, [userId, url]);

  return (
    <div>
      <input
        type="text"
        name="url"
        id="profile-url"
        placeholder="e.g. https://www.midjourney.com/app/users/128025340508504065/"
        onKeyUp={handleChange}
        onFocusCapture={() => {
          setTimeout(() => {
            document
              .getElementById("main")
              ?.scrollIntoView({ behavior: "smooth" });
          }, 0);
        }}
        value={url}
        disabled={Boolean(userId)}
        class={tw`p-4 text-gray-800 bg-white bg-blend-overlay rounded-lg shadow-2xl w-full ${
          userId ? tw`animate-pulse` : ""
        }`}
      />
    </div>
  );
}
