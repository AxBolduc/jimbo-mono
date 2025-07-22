import { Context, Effect, Layer } from "effect";
import { Blinds, Hands, Runs } from "../../db";
import { eq } from "drizzle-orm";
import { RunNotFoundError } from "../../errors/runNotFound.error";
import { DatabaseError } from "../../errors/db.error";
import { type CreateRun, type DBRun } from "../../schemas";
import { NoRunsFoundError } from "../../errors/noRunsFound.error";
import { SqliteDrizzle } from "@effect/sql-drizzle/Sqlite";

export class RunRepository extends Context.Tag("RunRepository")<
  RunRepository,
  {
    readonly getRuns: () => Effect.Effect<
      DBRun[],
      RunNotFoundError | DatabaseError
    >;
    readonly getRun: (
      id: string,
    ) => Effect.Effect<DBRun, RunNotFoundError | DatabaseError>;
    readonly createRun: (
      run: CreateRun,
    ) => Effect.Effect<string, DatabaseError>;
    readonly findAllRunsForUser: (
      userId: string,
      limit: number,
      offset: number,
    ) => Effect.Effect<DBRun[], NoRunsFoundError | DatabaseError>;
  }
>() { }

export const RunRepositoryLive = Layer.effect(
  RunRepository,
  Effect.gen(function* () {
    const db = yield* SqliteDrizzle;

    return {
      getRuns: () =>
        Effect.gen(function* () {
          const dbQuery = yield* Effect.tryPromise({
            try: async () => {
              const queryResult = await db
                .select({
                  id: Runs.id,
                  createdAt: Runs.createdAt,
                  userId: Runs.userId,
                  bestHand: Runs.bestHand,
                  mostPlayedHand: Hands.name,
                  cardsPlayed: Runs.cardsPlayed,
                  cardsDiscarded: Runs.cardsDiscarded,
                  cardsPurchased: Runs.cardsPurchased,
                  timesRerolled: Runs.timesRerolled,
                  newDiscoveries: Runs.newDiscoveries,
                  seed: Runs.seed,
                  ante: Runs.ante,
                  round: Runs.round,
                  won: Runs.won,
                  lostTo: Blinds.name,
                })
                .from(Runs)
                .innerJoin(Hands, eq(Runs.mostPlayedHand, Hands.id))
                .leftJoin(Blinds, eq(Runs.lostTo, Blinds.id));

              return queryResult;
            },
            catch: (unknownError) => {
              return new DatabaseError();
            },
          });

          if (dbQuery.length === 0) {
            return yield* Effect.fail(new RunNotFoundError("No runs found"));
          }

          return dbQuery;
        }),
      getRun: (id: string) =>
        Effect.gen(function* () {
          const dbQuery = yield* Effect.tryPromise({
            try: async () => {
              const queryResult = await db
                .select({
                  id: Runs.id,
                  createdAt: Runs.createdAt,
                  userId: Runs.userId,
                  bestHand: Runs.bestHand,
                  mostPlayedHand: Hands.name,
                  cardsPlayed: Runs.cardsPlayed,
                  cardsDiscarded: Runs.cardsDiscarded,
                  cardsPurchased: Runs.cardsPurchased,
                  timesRerolled: Runs.timesRerolled,
                  newDiscoveries: Runs.newDiscoveries,
                  seed: Runs.seed,
                  ante: Runs.ante,
                  round: Runs.round,
                  won: Runs.won,
                  lostTo: Blinds.name,
                })
                .from(Runs)
                .innerJoin(Hands, eq(Runs.mostPlayedHand, Hands.id))
                .leftJoin(Blinds, eq(Runs.lostTo, Blinds.id))
                .where(eq(Runs.id, id))
                .limit(1);

              return queryResult;
            },
            catch: (unknownError) => {
              return new DatabaseError();
            },
          });

          const resultRun = dbQuery.at(0);

          if (resultRun === undefined) {
            return yield* Effect.fail(new RunNotFoundError("Run not found"));
          }

          return resultRun;
        }),
      createRun: (run: CreateRun) =>
        Effect.gen(function* () {
          const dbQuery = yield* Effect.tryPromise({
            try: async () => {
              const insertedRun = await db
                .insert(Runs)
                .values({
                  id: crypto.randomUUID(),
                  ...run,
                  won: run.won ? 1 : 0,
                })
                .returning({ id: Runs.id });

              return insertedRun;
            },
            catch: (unknownError) => {
              return new DatabaseError();
            },
          });

          const resultRunId = dbQuery.at(0)?.id;

          if (resultRunId === undefined) {
            return yield* Effect.fail(new DatabaseError());
          }

          return resultRunId;
        }),
      findAllRunsForUser: (userId: string, limit: number, offset: number) =>
        Effect.gen(function* () {
          const dbQuery = yield* Effect.tryPromise({
            try: async () => {
              const queryResult = await db
                .select({
                  id: Runs.id,
                  createdAt: Runs.createdAt,
                  userId: Runs.userId,
                  bestHand: Runs.bestHand,
                  mostPlayedHand: Hands.name,
                  cardsPlayed: Runs.cardsPlayed,
                  cardsDiscarded: Runs.cardsDiscarded,
                  cardsPurchased: Runs.cardsPurchased,
                  timesRerolled: Runs.timesRerolled,
                  newDiscoveries: Runs.newDiscoveries,
                  seed: Runs.seed,
                  ante: Runs.ante,
                  round: Runs.round,
                  won: Runs.won,
                  lostTo: Blinds.name,
                })
                .from(Runs)
                .innerJoin(Hands, eq(Runs.mostPlayedHand, Hands.id))
                .leftJoin(Blinds, eq(Runs.lostTo, Blinds.id))
                .where(eq(Runs.userId, userId))
                .limit(limit)
                .offset(offset);

              return queryResult;
            },
            catch: (unknownError) => {
              return new DatabaseError();
            },
          });

          if (dbQuery.length === 0) {
            return yield* Effect.fail(new NoRunsFoundError());
          }

          return dbQuery;
        }),
    };
  }),
);
