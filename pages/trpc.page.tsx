import React from "react";
import { Header } from "./index.page";

export function Page() {
  const [value, setValue] = React.useState(0);

  return (
    <div>
      <Header />
      <div>server state = {value}</div>
      <div>
        <button onClick={() => setValue((prev) => prev - 1)}>-1</button>
        <button onClick={() => setValue((prev) => prev + 1)}>+1</button>
      </div>
    </div>
  );
}
