import { Context, Effect, Layer } from "effect";
import { DatabaseError } from "../../errors/db.error";
import { SqliteDrizzle } from "@effect/sql-drizzle/Sqlite";
import { Users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { UserNotFoundError } from "../../errors/userNotFound.error";

export class UserRepository extends Context.Tag("UserRepository")<
  UserRepository,
  {
    readonly getUserIdFromApiKey: (
      key: string,
    ) => Effect.Effect<string, DatabaseError | UserNotFoundError>;
  }
>() { }

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
