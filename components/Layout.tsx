/** @jsx h */
import { h, Fragment, FunctionComponent } from "preact";
import { tw } from "@twind";
import { Head } from "$fresh/src/runtime/head.ts";

export const Layout: FunctionComponent<{ title: string }> = ({
  children,
  title,
}) => {
  return (
    <Fragment>
      <Head>
        <style>{`html, body { height: 100% }`}</style>
        <title>{title}</title>
        <script
          defer
          data-domain="midjourney.observer"
          src="/js/script.js"
        ></script>
      </Head>
      <div class={tw`h-full bg-gray-900`}>{children}</div>
    </Fragment>
  );
};
