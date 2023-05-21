import { once } from "@hiogawa/utils";
import React from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { usePageContext } from "./common";

// quick hack to show fixed set of flush messages on redirection

export enum FlashType {
  RequireLogin = "0",
  AlreadyLoggedIn = "1",
  LoginSuccess = "2",
  LogoutSuccess = "3",
}

const Z_FLASH_TYPE = z.nativeEnum(FlashType);

const FLASH_KEY = "__flash";

const Z_FLASH_PARAMS = z.object({
  __flash: Z_FLASH_TYPE,
});

export function useFlushMessageHandler() {
  const ctx = usePageContext();

  // only once on mount
  useEffectNoStrict(() => {
    const parsed = Z_FLASH_PARAMS.safeParse(ctx.urlParsed.search);
    if (parsed.success) {
      switch (parsed.data.__flash) {
        case FlashType.AlreadyLoggedIn: {
          toast.error("Already logged in");
          break;
        }
        case FlashType.RequireLogin: {
          toast.error("Login required");
          break;
        }
        case FlashType.LoginSuccess: {
          toast.success("Successfully logged in");
          break;
        }
        case FlashType.LogoutSuccess: {
          toast.success("Successfully logged out");
          break;
        }
      }
      // mutate history in a way that vite-plugin-ssr won't notice (TODO: is it allowed?)
      const url = new URL(ctx.urlOriginal, DUMMY_BASE);
      url.searchParams.delete(FLASH_KEY);
      const urlString = url.toString().slice(DUMMY_BASE.length);
      window.history.replaceState(window.history.state, "", urlString);
    }
  }, []);
}

const DUMMY_BASE = "http://__dummy.local";

// workaround StrictMode double effect
function useEffectNoStrict(...args: Parameters<typeof React.useEffect>) {
  return React.useEffect(once(args[0]), args[1]);
}
