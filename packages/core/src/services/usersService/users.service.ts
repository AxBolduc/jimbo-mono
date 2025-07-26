import { Context, Effect, Layer, Schema } from "effect";
import { RunRepository, RunRepositoryLive } from "../../repositories/index.ts";
import { RunSchema, type Run } from "../../schemas/runs.ts";
import type { DatabaseError } from "../../errors/db.error.ts";
import type { NoRunsFoundError } from "../../errors/noRunsFound.error.ts";

export class UsersService extends Context.Tag("UsersService")<
  UsersService,
  {
    readonly getRunsForUser: (
      userId: string,
    ) => Effect.Effect<Run[], DatabaseError | NoRunsFoundError>;
  }
>() { }

export const UsersServiceLive = Layer.effect(
  UsersService,
  Effect.gen(function* () {
    const runsRepository = yield* RunRepository;

    return {
      getRunsForUser: (userId: string) =>
        Effect.gen(function* () {
          const runs = yield* runsRepository.findAllRunsForUser(userId, 10, 0);

          return Schema.decodeUnknownSync(
            Schema.mutable(Schema.Array(RunSchema)),
          )(runs);
        }),
    };
  }),
).pipe(Layer.provideMerge(RunRepositoryLive));
