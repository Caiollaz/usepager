CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_expires_at_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_provider_account_idx" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "projects_owner_id_idx" ON "projects" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "projects_owner_status_idx" ON "projects" USING btree ("owner_id","status");--> statement-breakpoint
CREATE INDEX "pages_project_id_idx" ON "pages" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "blocks_status_idx" ON "blocks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "blocks_category_idx" ON "blocks" USING btree ("category");--> statement-breakpoint
CREATE INDEX "assets_project_id_idx" ON "assets" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "assets_url_unique" ON "assets" USING btree ("url");--> statement-breakpoint
CREATE INDEX "publications_project_id_idx" ON "publications" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "publications_created_at_idx" ON "publications" USING btree ("created_at");
