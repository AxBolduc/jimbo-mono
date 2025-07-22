import { sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

export const Blinds = sqliteTable("Blinds", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
});

export const Hands = sqliteTable("Hands", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: text("id").primaryKey().notNull(),
  name: text("name").default("").notNull(),
  value: integer("value").notNull(),
});

export const Jokers = sqliteTable(
  "Jokers",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
  },
  (table) => [unique("Jokers_id_key").on(table.id)],
);

export const Runs = sqliteTable("Runs", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: text("id").primaryKey().notNull(),
  createdAt: text("createdAt")
    .default(sql`strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`)
    .notNull(),
  bestHand: text("bestHand").default("0").notNull(),
  cardsPlayed: integer("cardsPlayed").notNull(),
  cardsDiscarded: integer("cardsDiscarded").notNull(),
  cardsPurchased: integer("cardsPurchased").notNull(),
  timesRerolled: integer("timesRerolled").notNull(),
  newDiscoveries: integer("newDiscoveries").notNull(),
  seed: text("seed").default("").notNull(),
  ante: integer("ante").notNull(),
  round: integer("round").notNull(),
  won: integer("won").default(1).notNull(),
  lostTo: text("lostTo").references(() => Blinds.id),
  mostPlayedHand: text("mostPlayedHand")
    .notNull()
    .references(() => Hands.id),
  userId: text("userId")
    .notNull()
    .references(() => Users.id),
});

export const Users = sqliteTable(
  "Users",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: text("id").primaryKey().notNull(),
    createdAt: text("createdAt")
      .default(sql`strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`)
      .notNull(),
    username: text("username").notNull(),
    password: text("password").notNull(),
    apiKey: text("apiKey").notNull(),
  },
  (table) => [unique("Users_username_key").on(table.username)],
);

export const RunJokers = sqliteTable(
  "RunJokers",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    runId: text("runId")
      .notNull()
      .references(() => Runs.id),
    jokerId: text("jokerId")
      .notNull()
      .references(() => Jokers.id),
  },
  (table) => [
    primaryKey({
      columns: [table.runId, table.jokerId],
      name: "RunJokers_pkey",
    }),
  ],
);
