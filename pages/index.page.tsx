import React from "react";

export function Page() {
  const [value, setValue] = React.useState(0);

  return (
    <div className="flex flex-col gap-2 w-lg">
      <h2 className="text-lg">client counter example</h2>
      <div>counter: {value}</div>
      <div className="flex items-center gap-2">
        <button
          className="antd-btn antd-btn-default px-2"
          onClick={() => setValue((prev) => prev - 1)}
        >
          -1
        </button>
        <button
          className="antd-btn antd-btn-default px-2"
          onClick={() => setValue((prev) => prev + 1)}
        >
          +1
        </button>
      </div>
    </div>
  );
}
