import { Context, Effect } from "effect";
import type { Run } from "../../schemas";
import type { DatabaseError } from "../../errors/db.error";
import type { NoRunsFoundError } from "../../errors/noRunsFound.error";

export class UsersService extends Context.Tag("UsersService")<
  UsersService,
  {
    readonly getRunsForUser: (
      userId: number,
    ) => Effect.Effect<Run[], DatabaseError | NoRunsFoundError>;
  }
>() { }

export type UsersServiceShape = Context.Tag.Service<UsersService>;

export * from "./defaultUsersService";
export * from "./errors";
