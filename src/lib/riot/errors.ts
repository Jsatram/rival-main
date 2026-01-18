export type RiotErrorCode =
  | "RATE_LIMITED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "UPSTREAM_ERROR"
  | "NETWORK_ERROR"
  | "BAD_REQUEST";

export class RiotApiError extends Error {
  code: RiotErrorCode;
  status?: number;
  endpoint: string;
  details?: unknown;
  retryAfterSeconds?: number;

  constructor(args: {
    code: RiotErrorCode;
    message: string;
    endpoint: string;
    status?: number;
    details?: unknown;
    retryAfterSeconds?: number;
  }) {
    super(args.message);
    this.name = "RiotApiError";
    this.code = args.code;
    this.status = args.status;
    this.endpoint = args.endpoint;
    this.details = args.details;
    this.retryAfterSeconds = args.retryAfterSeconds;
  }
}

export function isRiotApiError(err: unknown): err is RiotApiError {
  return err instanceof RiotApiError;
}
