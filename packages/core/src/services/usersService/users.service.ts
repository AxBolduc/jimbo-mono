import { Context, Effect, Layer } from "effect";
export class UsersService extends Context.Tag("UsersService")<
  UsersService,
  {}
>() { }

export const UsersServiceLive = Layer.effect(
  UsersService,
  Effect.gen(function* () {
    return {};
  }),
);
