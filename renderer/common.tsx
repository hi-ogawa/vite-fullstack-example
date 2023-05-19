import { Compose } from "@hiogawa/utils-react";
import React from "react";
import { ReactQueryWrapper } from "../src/utils/react-query-utils";
import { ToastWrapper } from "../src/utils/toast-utils";

export const PAGE_DOM_ID = "__page";

export function PageWrapper(props: { children: React.ReactElement }) {
  return (
    <Compose
      elements={[<ToastWrapper />, <ReactQueryWrapper />, props.children]}
    />
  );
}
