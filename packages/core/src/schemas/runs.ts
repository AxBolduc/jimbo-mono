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
  lostTo: Schema.NullOr(Schema.String),
});

export const CreateRunSchema = Schema.Struct({
  ...RunSchema.omit("id", "createdAt").fields,
  userId: Schema.Int,
});

export const UpdateRunSchema = Schema.partial(CreateRunSchema);

export type Run = typeof RunSchema.Type;
export type CreateRun = typeof CreateRunSchema.Type;
export type UpdateRun = typeof UpdateRunSchema.Type;
