import { Effect } from "effect";
import { UserNotFoundError, type UsersServiceShape } from "./index.ts";

export const DefaultUsersService: UsersServiceShape = {
  getRunsForUser: (userId: number) =>
    Effect.gen(function* () {
      if (new Date().getTime() % 2 === 0) {
        return yield* Effect.fail(new UserNotFoundError());
      }

      return [
        {
          id: userId,
          createdAt: new Date(),
          bestHand: "bestHand",
          mostPlayedHand: "mostPlayedHand",
          cardsPlayed: 1,
          cardsDiscarded: 1,
          cardsPurchased: 1,
          timesRerolled: 1,
          newDiscoveries: 1,
          seed: "seed",
          ante: 1,
          round: 1,
          won: true,
          lostTo: null,
        },
      ];
    }),
};
