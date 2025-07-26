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

export class RunsService extends Context.Tag("UsersService")<
  RunsService,
  {
    readonly createRun: (
      apiKey: string,
      run: CreateRun,
    ) => Effect.Effect<Run, DatabaseError | UserNotFoundError>;
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
    };
  }),
).pipe(
  Layer.provideMerge(UserRepositoryLive),
  Layer.provideMerge(RunRepositoryLive),
);
