import { Blinds, Hands, Runs } from "../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db";

export namespace RunRepository {
  export async function getRuns() {
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
      .leftJoin(Hands, eq(Runs.mostPlayedHand, Hands.id))
      .leftJoin(Blinds, eq(Runs.lostTo, Blinds.id));

    if (queryResult.length == 0) {
      throw new Error(`No runs found`);
    }

    return queryResult;
  }

  export async function getRun(id: number) {
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
      .leftJoin(Hands, eq(Runs.mostPlayedHand, Hands.id))
      .leftJoin(Blinds, eq(Runs.lostTo, Blinds.id))
      .where(eq(Runs.id, id));

    if (queryResult.length == 0) {
      throw new Error(`Run with id ${id} not found`);
    }

    const test = queryResult.at(0);
    return test;
  }

  export async function createRun(run: typeof Runs.$inferInsert) {
    const insertedRun = await db
      .insert(Runs)
      .values(run)
      .returning({ id: Runs.id });

    if (insertedRun.length == 0) {
      throw new Error("Failed to insert run to db");
    }

    return insertedRun[0];
  }

  export async function findAllRunsForUser(
    userId: number,
    limit: number,
    offset: number = 0,
  ) {
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

    if (queryResult.length < 1) {
      throw new Error(
        `Failed to get runs for userId: ${userId}, no runs found`,
      );
    }

    return queryResult;
  }
}
