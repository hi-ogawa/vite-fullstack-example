import { Compose } from "@hiogawa/utils-react";
import React from "react";
import { ReactQueryWrapper } from "../src/utils/react-query-utils";
import { ToastWrapper } from "../src/utils/toast-utils";
import { Root } from "./root";

export const PAGE_DOM_ID = "__page";

export function PageWrapper(props: React.PropsWithChildren) {
  return (
    <Compose elements={[<ToastWrapper />, <ReactQueryWrapper />, <Root />]}>
      <HydratedTestId />
      {props.children}
    </Compose>
  );
}

// for e2e
function HydratedTestId() {
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => setHydrated(true), []);

  return <div data-testid={hydrated ? "hydrated" : undefined}></div>;
}
