import React from "react";

export function Root(props: React.PropsWithChildren) {
  return (
    <div className="relative z-0">
      <header className="flex items-center gap-3 p-2 px-3 shadow-md shadow-black/[0.05] dark:shadow-black/[0.7] relative z-1">
        <span className="text-lg">Example</span>
        <span className="flex-1"></span>
        <ThemeSelect />
        <a
          className="i-ri-github-line w-6 h-6"
          href="https://github.com/hi-ogawa/vite-fullstack-example"
          target="_blank"
        ></a>
      </header>
      <main>{props.children}</main>
    </div>
  );
}

//
// theme select
//

declare let __themeGet: () => string;
declare let __themeSet: (theme: string) => void;

function ThemeSelect() {
  return (
    <button
      className="dark:i-ri-sun-line light:i-ri-moon-line !w-6 !h-6"
      onClick={() => {
        __themeSet(__themeGet() === "dark" ? "light" : "dark");
      }}
    ></button>
  );
}
