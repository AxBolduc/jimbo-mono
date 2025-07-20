import { Schema } from "effect";

export const UserSchema = Schema.Struct({
  username: Schema.String,
  password: Schema.String,
});

export const RegisterUserSchema = Schema.Struct({
  username: Schema.String.pipe(Schema.minLength(4), Schema.maxLength(20)),
  password: Schema.String.pipe(Schema.minLength(8), Schema.maxLength(20)),
});

export type User = typeof UserSchema.Type;
export type RegisterUser = typeof RegisterUserSchema.Type;
