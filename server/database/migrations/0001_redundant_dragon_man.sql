ALTER TABLE "units" RENAME COLUMN "academic_year_id" TO "class_id";--> statement-breakpoint
ALTER TABLE "rotation_groups" ALTER COLUMN "start_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "rotation_groups" ALTER COLUMN "end_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;