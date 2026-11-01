ALTER TABLE `notes` ADD `is_archived` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `notes` ADD `is_junk` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `notes` ADD `is_favorite` integer DEFAULT false NOT NULL;