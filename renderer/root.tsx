import React from "react";

export function Root(props: React.PropsWithChildren) {
  return (
    <div>
      <header className="flex items-center gap-3 p-2 px-3 shadow-md shadow-black/[0.05] dark:shadow-black/[0.7]">
        <div className="flex gap-3">
          Pages
          <PageLinkList />
        </div>
        <span className="flex-1"></span>
        <ThemeSelect />
        <a
          className="i-ri-github-line w-6 h-6"
          href="https://github.com/hi-ogawa/vite-fullstack-example"
          target="_blank"
        ></a>
      </header>
      <main className="flex flex-col items-center p-4">{props.children}</main>
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

function PageLinkList() {
  return (
    <ul className="flex items-center gap-3">
      {LINKS.map((href) => (
        <li key={href}>
          {/* TODO: style active link */}
          <a
            className="antd-btn antd-btn-default p-0.5 px-1 font-mono text-sm"
            href={href}
          >
            {href}
          </a>
        </li>
      ))}
    </ul>
  );
}

const LINKS = ["/", "/server-counter", "/session/login", "/session/me"];
