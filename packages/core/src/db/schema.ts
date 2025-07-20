import {
  bigint,
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const Blinds = pgTable("Blinds", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
});

export const Hands = pgTable("Hands", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: serial("id").primaryKey().notNull(),
  name: text("name").default("").notNull(),
  value: integer("value").notNull(),
});

export const Jokers = pgTable(
  "Jokers",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: serial("id").primaryKey().notNull(),
    name: text("name").notNull(),
  },
  (table) => [unique("Jokers_id_key").on(table.id)],
);

export const Runs = pgTable("Runs", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: serial("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" })
    .defaultNow()
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
  won: boolean("won").default(true).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  lostTo: bigint("lostTo", { mode: "number" }).references(() => Blinds.id),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  mostPlayedHand: bigint("mostPlayedHand", { mode: "number" })
    .notNull()
    .references(() => Hands.id),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  userId: bigint("userId", { mode: "number" })
    .notNull()
    .references(() => Users.id),
});

export const Users = pgTable(
  "Users",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: serial("id").primaryKey().notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    username: text("username").notNull(),
    password: text("password").notNull(),
    apiKey: text("apiKey").notNull(),
  },
  (table) => [unique("Users_username_key").on(table.username)],
);

export const RunJokers = pgTable(
  "RunJokers",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    runId: bigint("runId", { mode: "number" })
      .notNull()
      .references(() => Runs.id),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    jokerId: bigint("jokerId", { mode: "number" })
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
