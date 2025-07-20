import { Context, Effect } from "effect";
import type { Run } from "../../schemas";
import type { UserNotFoundError } from "./errors";

export class UsersService extends Context.Tag("UsersService")<
  UsersService,
  {
    readonly getRunsForUser: (
      userId: number,
    ) => Effect.Effect<Run[], UserNotFoundError>;
  }
>() { }

export type UsersServiceShape = Context.Tag.Service<UsersService>;

export * from "./defaultUsersService";
export * from "./errors";
