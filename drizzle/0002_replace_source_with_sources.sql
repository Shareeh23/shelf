PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category` text DEFAULT 'General' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`sources` text DEFAULT '[]' NOT NULL,
	`content` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_notes` (
  `id`,
  `title`,
  `category`,
  `description`,
  `sources`,
  `content`,
  `user_id`,
  `created_at`,
  `updated_at`
)
SELECT
  `id`,
  `title`,
  `category`,
  `description`,
  CASE
    WHEN `source` IS NULL OR `source` = '' THEN '[]'
    ELSE json_array(`source`)
  END,
  `content`,
  `user_id`,
  `created_at`,
  `updated_at`
FROM `notes`;--> statement-breakpoint
DROP TABLE `notes`;--> statement-breakpoint
ALTER TABLE `__new_notes` RENAME TO `notes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `notes_user_id_idx` ON `notes` (`user_id`);