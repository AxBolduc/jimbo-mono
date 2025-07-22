import { Context, type Effect } from "effect";
import type { DatabaseError } from "../../errors/db.error";
import type { UserNotFoundError } from "../../services";

export class UserRepository extends Context.Tag("UserRepository")<
  UserRepository,
  {
    readonly getUserIdFromApiKey: (
      key: string,
    ) => Effect.Effect<string, DatabaseError | UserNotFoundError>;
  }
>() { }

export type UserRepositoryShape = Context.Tag.Service<UserRepository>;

export * from "./user.repository";
