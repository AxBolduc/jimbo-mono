import { Effect } from "effect";
import type { UserRepositoryShape } from ".";
import { db, Users } from "../../db";
import { eq } from "drizzle-orm";
import { UserNotFoundError } from "../../services";
import { DatabaseError } from "../../errors/db.error";

export const DefaultUserRepository: UserRepositoryShape = {
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
