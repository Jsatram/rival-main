export const analysisCoreVersion = "0.1.0";

export function ping(): "pong" {
  return "pong";
}

export * from "./compute/fromFixture";
export * from "./fixtures/loadFixture";
export * from "./fixtures/types";
