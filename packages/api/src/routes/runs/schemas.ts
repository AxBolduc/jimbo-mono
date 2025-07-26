import { CreateRunSchema } from "@jimbostats/core/schemas";
import { Schema } from "effect";

export const CreateRunRequestSchema = Schema.Struct({
  apiKey: Schema.String,
  run: CreateRunSchema,
});
