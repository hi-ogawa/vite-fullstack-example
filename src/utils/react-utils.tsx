import { once, tinyassert } from "@hiogawa/utils";
import React from "react";

// workaround StrictMode double effect
export function useEffectNoStrict(...args: Parameters<typeof React.useEffect>) {
  return React.useEffect(once(args[0]), args[1]);
}

// standard pattern of exposing global value via context
export function createSimpleReactContext<T>() {
  const uninitialized = Symbol();

  const context = React.createContext<T>(uninitialized as T);

  function useContext() {
    const value = React.useContext(context);
    tinyassert(value !== uninitialized, "uninitialized context");
    return value;
  }

  return [context.Provider, useContext] as const;
}
