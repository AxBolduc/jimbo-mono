import { Context, Layer, type Effect } from "effect";
import type { DatabaseError } from "../../errors/db.error";
import type { UserNotFoundError } from "../../services";
import { DefaultUserRepository } from "./user.repository";

export class UserRepository extends Context.Tag("UserRepository")<
  UserRepository,
  {
    readonly getUserIdFromApiKey: (
      key: string,
    ) => Effect.Effect<number, DatabaseError | UserNotFoundError>;
  }
>() { }

export type UserRepositoryShape = Context.Tag.Service<UserRepository>;

export const UserRepositoryLive = Layer.succeed(
  UserRepository,
  DefaultUserRepository,
);

export * from "./user.repository";
