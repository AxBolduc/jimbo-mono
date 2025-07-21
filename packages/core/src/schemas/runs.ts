import { Schema } from "effect";

export const RunSchema = Schema.Struct({
  id: Schema.Int,
  createdAt: Schema.Date,
  bestHand: Schema.String,
  mostPlayedHand: Schema.String,
  cardsPlayed: Schema.Int,
  cardsDiscarded: Schema.Int,
  cardsPurchased: Schema.Int,
  timesRerolled: Schema.Int,
  newDiscoveries: Schema.Int,
  seed: Schema.String,
  ante: Schema.Int,
  round: Schema.Int,
  won: Schema.Boolean,
  lostTo: Schema.String.pipe(Schema.NullOr, Schema.optional),
});

export const CreateRunSchema = Schema.Struct({
  ...RunSchema.omit("id", "createdAt", "mostPlayedHand", "lostTo").fields,
  userId: Schema.Int,
  mostPlayedHand: Schema.Int,
  lostTo: Schema.optional(Schema.Int),
});

export const UpdateRunSchema = Schema.partial(CreateRunSchema);

export type Run = typeof RunSchema.Type;
export type CreateRun = typeof CreateRunSchema.Type;
export type UpdateRun = typeof UpdateRunSchema.Type;
