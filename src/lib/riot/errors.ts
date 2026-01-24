import type { RiotRateLimitInfo, RiotRequestMeta } from "./types";

export class RiotApiError extends Error {
  public readonly status: number;
  public readonly meta: RiotRequestMeta;
  public readonly rateLimit?: RiotRateLimitInfo;
  public readonly bodyText?: string;

  constructor(opts: {
    message: string;
    status: number;
    meta: RiotRequestMeta;
    rateLimit?: RiotRateLimitInfo;
    bodyText?: string;
  }) {
    super(opts.message);
    this.name = "RiotApiError";
    this.status = opts.status;
    this.meta = opts.meta;
    this.rateLimit = opts.rateLimit;
    this.bodyText = opts.bodyText;
  }
}

export class RiotConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RiotConfigError";
  }
}

export class RiotNetworkError extends Error {
  public readonly meta: RiotRequestMeta;

  constructor(message: string, meta: RiotRequestMeta) {
    super(message);
    this.name = "RiotNetworkError";
    this.meta = meta;
  }
}
