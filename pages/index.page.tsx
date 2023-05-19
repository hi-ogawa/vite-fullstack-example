import React from "react";

export function Page() {
  const [value, setValue] = React.useState(0);

  return (
    <div>
      <Header />
      value = {value}
      <div>
        <button onClick={() => setValue((prev) => prev - 1)}>-1</button>
        <button onClick={() => setValue((prev) => prev + 1)}>+1</button>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header>
      <ul>
        <li>
          <a href="/">/</a>
        </li>
        <li>
          <a href="/other">/other</a>
        </li>
      </ul>
    </header>
  );
}
