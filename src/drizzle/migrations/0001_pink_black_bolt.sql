ALTER TABLE "countrie" RENAME TO "countries";--> statement-breakpoint
ALTER TABLE "countries" DROP CONSTRAINT "countrie_name_unique";--> statement-breakpoint
ALTER TABLE "countries" DROP CONSTRAINT "countrie_code_unique";--> statement-breakpoint
ALTER TABLE "countries" DROP CONSTRAINT "countrie_country_group_id_country_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "product_views" DROP CONSTRAINT "product_views_country_id_countrie_id_fk";
--> statement-breakpoint
ALTER TABLE "countries" ADD CONSTRAINT "countries_country_group_id_country_groups_id_fk" FOREIGN KEY ("country_group_id") REFERENCES "public"."country_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "countries" ADD CONSTRAINT "countries_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "countries" ADD CONSTRAINT "countries_code_unique" UNIQUE("code");