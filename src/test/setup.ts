import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import matchers from "@testing-library/jest-dom/matchers";
import fetch from "cross-fetch";

declare global {
  var user: ReturnType<typeof userEvent.setup>;
}

expect.extend(matchers);
global.fetch = fetch;

beforeEach(() => {
  global.user = userEvent.setup();
});
afterEach(() => {
  cleanup();
});
