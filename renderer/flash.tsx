import { once } from "@hiogawa/utils";
import React from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { usePageContext } from "./common";

// quick hack to show fixed set of flash messages on redirection

export enum FlashType {
  RequireLogin = "0",
  AlreadyLoggedIn = "1",
  LoginSuccess = "2",
  LogoutSuccess = "3",
}

export const Z_FLASH_QUERY = z.object({
  flash: z.nativeEnum(FlashType).optional(),
});

export function useFlashMessageHandler() {
  const ctx = usePageContext();

  // only once on mount
  useEffectNoStrict(() => {
    const parsed = Z_FLASH_QUERY.safeParse(ctx.urlParsed.search);
    if (parsed.success && parsed.data.flash) {
      switch (parsed.data.flash) {
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
      url.searchParams.delete(Z_FLASH_QUERY.keyof().enum.flash);
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
