import { Data } from "effect";

export class NoRunsFoundError extends Data.TaggedError("NoRunsFoundError") { }
