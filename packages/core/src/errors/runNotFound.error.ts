import { Data } from "effect";

export class RunNotFoundError extends Data.TaggedError("RunNotFoundError")<{
  message: string;
}> {
  constructor(message: string) {
    super({ message });
  }
}
