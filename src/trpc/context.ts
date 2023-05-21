import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initializeSession } from "../utils/session-utils";

export type TrpcAppContext = Awaited<ReturnType<typeof createTrpcAppContext>>;

export const createTrpcAppContext = async ({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) => {
  return {
    session: await initializeSession(req.headers, resHeaders),
  };
};
