import "@hattip/compose";

// interface merging for custom request context

declare module "@hattip/compose" {
  interface RequestContextExtensions {
    session: import("../utils/session-utils").Session;
  }
}
