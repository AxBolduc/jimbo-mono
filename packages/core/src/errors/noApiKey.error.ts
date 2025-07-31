import * as Data from "effect/Data";

export class NoApiKeyError extends Data.TaggedError("NoApiKeyError")<{
  message: string;
}> { }
