CREATE TABLE `Blinds` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Hands` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`value` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Jokers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Jokers_id_key` ON `Jokers` (`id`);--> statement-breakpoint
CREATE TABLE `RunJokers` (
	`runId` text NOT NULL,
	`jokerId` text NOT NULL,
	PRIMARY KEY(`runId`, `jokerId`),
	FOREIGN KEY (`runId`) REFERENCES `Runs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`jokerId`) REFERENCES `Jokers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Runs` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` text DEFAULT strftime('%Y-%m-%dT%H:%M:%fZ', 'now') NOT NULL,
	`bestHand` text DEFAULT '0' NOT NULL,
	`cardsPlayed` integer NOT NULL,
	`cardsDiscarded` integer NOT NULL,
	`cardsPurchased` integer NOT NULL,
	`timesRerolled` integer NOT NULL,
	`newDiscoveries` integer NOT NULL,
	`seed` text DEFAULT '' NOT NULL,
	`ante` integer NOT NULL,
	`round` integer NOT NULL,
	`won` integer DEFAULT 1 NOT NULL,
	`lostTo` text,
	`mostPlayedHand` text NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`lostTo`) REFERENCES `Blinds`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`mostPlayedHand`) REFERENCES `Hands`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` text DEFAULT strftime('%Y-%m-%dT%H:%M:%fZ', 'now') NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`apiKey` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Users_username_key` ON `Users` (`username`);