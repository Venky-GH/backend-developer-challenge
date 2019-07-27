-- Adminer 4.6.3 PostgreSQL dump

\connect "modexcel_db";

DROP TABLE IF EXISTS "donation_details";
DROP SEQUENCE IF EXISTS donation_details_id_seq;
CREATE SEQUENCE donation_details_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;

CREATE TABLE "public"."donation_details" (
    "order_id" character varying NOT NULL,
    "date" character varying NOT NULL,
    "non_profit" text NOT NULL,
    "donation_currency" text NOT NULL,
    "donation_amount" double precision NOT NULL,
    "fee" double precision NOT NULL,
    "id" integer DEFAULT nextval('donation_details_id_seq') NOT NULL,
    "base_currency" text NOT NULL,
    CONSTRAINT "donation_details_id" PRIMARY KEY ("id"),
    CONSTRAINT "donation_details_order_id" UNIQUE ("order_id")
) WITH (oids = false);


-- 2019-07-27 09:09:22.231698+00
