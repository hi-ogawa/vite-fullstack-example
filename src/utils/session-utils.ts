import { tinyassert } from "@hiogawa/utils";
import { type IronSession, getIronSession } from "iron-session";
import { z } from "zod";
import { serverConfig } from "./config";

//
// session data schema
//

const Z_SESSION_DATA = z.object({
  user: z
    .object({
      name: z.string(),
    })
    .optional(),
});

export type SessionData = z.infer<typeof Z_SESSION_DATA>;

//
// request/response wrapper based on iron-session
//

export type Session = IronSession & SessionData;

export async function initializeSession(
  reqHeaders: Headers,
  resHeaders: Headers
) {
  // borrow iron-session with minimal compatibility hack
  // https://github.com/vvo/iron-session/blob/70d2ff14aacb51e83284d51832fdcda539b4dabc/src/core.ts
  const req = {
    credentials: "__dummy",
    headers: reqHeaders,
  } as any as Request;

  const res = {
    headers: resHeaders,
  } as any as Response;

  const ironSession = await getIronSession(req, res, {
    // default cookie config seems okay https://github.com/vvo/iron-session/blob/70d2ff14aacb51e83284d51832fdcda539b4dabc/src/core.ts#L20
    password: serverConfig.APP_SESSION_PASSWORD,
    cookieName: serverConfig.APP_SESSION_NAME,
  });

  // validate session data
  Z_SESSION_DATA.parse(ironSession);
  return ironSession as IronSession & SessionData;
}

// for testing
export async function injectSessionData(
  reqHeaders: Headers,
  data: SessionData
): Promise<void> {
  // write cookie to temporary response headers
  const resHeaders = new Headers();
  const session = await initializeSession(new Headers(), resHeaders);
  Object.assign(session, data);
  await session.save();

  // copy to request headers
  const cookie = resHeaders.get("set-cookie");
  tinyassert(cookie);
  reqHeaders.set("cookie", cookie);
}
