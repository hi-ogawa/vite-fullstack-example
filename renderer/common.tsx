import { Compose } from "@hiogawa/utils-react";
import React from "react";
import { ReactQueryWrapper } from "../src/utils/react-query-utils";
import { ToastWrapper } from "../src/utils/toast-utils";
import { Root } from "./root";
import type { PageContext } from "./types";

// TODO: avoid circular deps...

export const PAGE_DOM_ID = "__page";

export function PageWrapper(
  props: React.PropsWithChildren<{ pageContext: PageContext }>
) {
  return (
    <Compose
      elements={[
        <ToastWrapper />,
        <ReactQueryWrapper />,
        <pageContextContext.Provider value={props.pageContext} />,
        <Root />,
      ]}
    >
      <HydratedTestId />
      {props.children}
    </Compose>
  );
}

// expose PageContext globally
const pageContextContext = React.createContext<PageContext>(undefined!);

export function usePageContext() {
  return React.useContext(pageContextContext);
}

// for e2e
function HydratedTestId() {
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => setHydrated(true), []);

  return <div data-testid={hydrated ? "hydrated" : undefined}></div>;
}
