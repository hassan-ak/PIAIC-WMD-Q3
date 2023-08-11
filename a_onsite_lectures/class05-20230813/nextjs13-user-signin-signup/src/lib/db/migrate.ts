/**
 * Comment or uncomment the section based storage
 */

// /**
//  * if storage is connected to single applications
//  * update script in package.json to "migrate": "drizzle-kit push:pg"
//  */
// import { migrate } from "drizzle-orm/vercel-postgres/migrator";
// import { db } from "./drizzle";
// await migrate(db, { migrationsFolder: "drizzle" });

/**
 * if storage is connected to multiple applications
 * update script in package.json to "migrate": "node -r esbuild-register src/lib/db/migrate.ts"
 *
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();
const connectionString = process.env.POSTGRES_URL + "?sslmode=require" || "";
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);
migrate(db, { migrationsFolder: "drizzle" })
  .then((msg) => {
    console.log("Migration successful ===> ", msg);
  })
  .catch((err) => {
    console.log("Migration failed ===> ", err);
  });
