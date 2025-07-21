import { Context, Effect, Layer } from "effect";
import type { CreateRun, Run } from "../../schemas";
import type { RunNotFoundError } from "../../errors/runNotFound.error";
import type { DatabaseError } from "../../errors/db.error";
import type { NoRunsFoundError } from "../../errors/noRunsFound.error";
import { DefaultRunRepository } from "./run.repository";

export class RunRepository extends Context.Tag("RunRepository")<
  RunRepository,
  {
    readonly getRuns: () => Effect.Effect<
      Run[],
      RunNotFoundError | DatabaseError
    >;
    readonly getRun: (
      id: number,
    ) => Effect.Effect<Run, RunNotFoundError | DatabaseError>;
    readonly createRun: (
      run: CreateRun,
    ) => Effect.Effect<number, DatabaseError>;
    readonly findAllRunsForUser: (
      userId: number,
      limit: number,
      offset: number,
    ) => Effect.Effect<Run[], NoRunsFoundError | DatabaseError>;
  }
>() { }

export type RunRepositoryShape = Context.Tag.Service<RunRepository>;

export const RunRepositoryLive = Layer.succeed(
  RunRepository,
  DefaultRunRepository,
);

export * from "./run.repository";
