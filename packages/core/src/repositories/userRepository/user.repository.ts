import { Effect, Layer } from "effect";
import { Users } from "../../db";
import { eq } from "drizzle-orm";
import { UserNotFoundError } from "../../services";
import { DatabaseError } from "../../errors/db.error";
import { UserRepository } from "..";
import { SqliteDrizzle } from "@effect/sql-drizzle/Sqlite";

export const UserRepositoryLive = Layer.effect(
  UserRepository,
  Effect.gen(function* () {
    const db = yield* SqliteDrizzle;

    return {
      getUserIdFromApiKey: (key: string) =>
        Effect.gen(function* () {
          const dbQuery = yield* Effect.tryPromise({
            try: async () => {
              const selectedUserIdResult = await db
                .select({ id: Users.id })
                .from(Users)
                .where(eq(Users.apiKey, key))
                .limit(1);

              return selectedUserIdResult;
            },
            catch: (unknownError) => {
              return new DatabaseError();
            },
          });

          const selectedUserId = dbQuery.at(0)?.id;

          if (!selectedUserId) {
            return yield* Effect.fail(new UserNotFoundError());
          }

          return selectedUserId;
        }),
    };
  }),
);
