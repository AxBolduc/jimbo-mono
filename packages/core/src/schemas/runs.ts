import { Schema } from "effect";

export const RunSchema = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.String,
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
  won: Schema.transform(Schema.Int, Schema.Boolean, {
    strict: true,
    encode: (value) => (value ? 1 : 0),
    decode: (value) => value === 1,
  }),
  lostTo: Schema.String.pipe(Schema.NullOr, Schema.optional),
});

export const CreateRunSchema = Schema.Struct({
  ...RunSchema.omit("id", "createdAt", "mostPlayedHand", "lostTo").fields,
  mostPlayedHand: Schema.String,
  lostTo: Schema.optional(Schema.String),
});

export const UpdateRunSchema = Schema.partial(CreateRunSchema);

export type DBRun = typeof RunSchema.Encoded;
export type Run = typeof RunSchema.Type;
export type CreateRun = typeof CreateRunSchema.Type;
export type UpdateRun = typeof UpdateRunSchema.Type;
