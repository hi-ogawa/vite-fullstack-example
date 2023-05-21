import { createSimpleReactContext } from "../src/utils/react-utils";
import type { PageContext } from "./types";

export const PAGE_DOM_ID = "__page";

// expose PageContext globally
const [PageContextProvider, usePageContext] =
  createSimpleReactContext<PageContext>();

export { PageContextProvider, usePageContext };
