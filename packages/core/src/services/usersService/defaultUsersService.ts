import { Effect, Layer } from "effect";
import { UsersService } from "./index.ts";
import { RunRepository } from "../../repositories/index.ts";

export const UsersServiceLive = Layer.effect(
  UsersService,
  Effect.gen(function* () {
    const runsRepository = yield* RunRepository;

    return {
      getRunsForUser: (userId: number) =>
        Effect.gen(function* () {
          const runs = yield* runsRepository.findAllRunsForUser(userId, 10, 0);

          return runs;
        }),
    };
  }),
);
