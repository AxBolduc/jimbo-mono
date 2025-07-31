import { Context, Effect, Layer, Schema } from "effect";
import { RunSchema, type CreateRun, type Run } from "../../schemas";
import type { DatabaseError } from "../../errors/db.error";
import type { UserNotFoundError } from "../../errors/userNotFound.error";
import {
  UserRepository,
  UserRepositoryLive,
} from "../../repositories/userRepository";
import {
  RunRepository,
  RunRepositoryLive,
} from "../../repositories/runRepository";
import type { NoRunsFoundError } from "../../errors";

export class RunsService extends Context.Tag("UsersService")<
  RunsService,
  {
    readonly createRun: (
      apiKey: string,
      run: CreateRun,
    ) => Effect.Effect<Run, DatabaseError | UserNotFoundError>;
    readonly getRunsForUser: (
      userId: string,
    ) => Effect.Effect<readonly Run[], DatabaseError | NoRunsFoundError>;
  }
>() { }

export const RunsServiceLive = Layer.effect(
  RunsService,
  Effect.gen(function* () {
    const userRepository = yield* UserRepository;
    const runsRepository = yield* RunRepository;

    return {
      createRun: (apiKey: string, run: CreateRun) =>
        Effect.gen(function* () {
          const userId = yield* userRepository.getUserIdFromApiKey(apiKey);
          const createdRun = yield* runsRepository.createRun(userId, run);

          return Schema.decodeUnknownSync(RunSchema)(createdRun);
        }),
      getRunsForUser: (userId: string) =>
        Effect.gen(function* () {
          const runs = yield* runsRepository.findAllRunsForUser(userId, 10, 0);

          return Schema.decodeUnknownSync(Schema.Array(RunSchema))(runs);
        }),
    };
  }),
).pipe(
  Layer.provideMerge(UserRepositoryLive),
  Layer.provideMerge(RunRepositoryLive),
);
