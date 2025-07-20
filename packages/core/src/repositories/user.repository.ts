import { db } from "../db";
import { eq } from "drizzle-orm";
import { Users } from "../db/schema";

export namespace RunService {
  export async function getUserIdFromApiKey(key: string) {
    const selectedUserIdResult = await db
      .select({ id: Users.id })
      .from(Users)
      .where(eq(Users.apiKey, key))
      .limit(1);

    const selectedUserId = selectedUserIdResult[0]?.id;

    if (!selectedUserId) {
      throw new Error(`Could not find user with api key ${key}`);
    }

    return selectedUserId;
  }
}
