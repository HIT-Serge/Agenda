CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`hour` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`cancel_token` text NOT NULL,
	`created_at` text NOT NULL,
	`cancelled_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_cancel_token_unique` ON `bookings` (`cancel_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_bookings_active_slot` ON `bookings` (`day`,`hour`) WHERE "bookings"."cancelled_at" is null;