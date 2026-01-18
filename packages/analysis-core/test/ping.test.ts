import { describe, expect, it } from "vitest";
import { ping } from "../src/index";

describe("analysis-core scaffold", () => {
  it("ping returns pong", () => {
    expect(ping()).toBe("pong");
  });
});
