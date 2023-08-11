# JWT Authentication in Next.js 13 API Route Handlers

### Create a Next.JS 13 app

1. Create a new nextJS app using following command
   ```npx
   npx create-next-app@latest
   ```
2. Select the following options when prompted
   ```
   Need to install the following packages:
   create-next-app@13.4.13
   Ok to proceed? (y)
   ✔ What is your project named? … nextjs13-user-signin-signup
   ✔ Would you like to use TypeScript? … Yes
   ✔ Would you like to use ESLint? … Yes
   ✔ Would you like to use Tailwind CSS? … Yes
   ✔ Would you like to use `src/` directory? … Yes
   ✔ Would you like to use App Router? (recommended) … Yes
   ✔ Would you like to customize the default import alias? … No
   ```
3. Navigate to newly created application directory
   ```cmd
   cd nextjs13-user-signin-signup
   ```
4. Run the app i development mode
   ```npm
   npm run dev
   ```

### Deploy the app on vercel

5. Sign up or log in at [vercel](https://vercel.com/).
6. Install vercel cli
   ```npm
   npm i -g vercel
   ```
7. From the terminal log in to vercel
   ```cmd
   vercel login
   ```
8. Deploy the app
   ```cmd
   vercel
   ```

### Connect to vercel postgres

9. On vercel dashboard navigate to storage tab and create a new postgres storage. You can also select an already created storage
10. Connect the deployed project with the selected storage
11. Pull your latest environment variables
    ```cmd
    vercel env pull .env.development.local
    ```
12. Install postgres and drizzle in the app
    ```npm
    npm i drizzle-orm
    npm i @vercel/postgres
    npm i -D drizzle-kit
    ```
13. Create `/src/lib/db/drizzle.ts` to define db connection
    ```ts
    import { sql } from "@vercel/postgres";
    import { drizzle } from "drizzle-orm/vercel-postgres";
    export const db = drizzle(sql);
    ```

### Create schema and infer types

14. Create `/src/lib/db/schema/script.ts` to define tables schema
    ```ts
    import {
      pgTable,
      serial,
      varchar,
      boolean,
      timestamp,
    } from "drizzle-orm/pg-core";
    export const jwt_users = pgTable("jwt_users", {
      user_id: serial("user_id").primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      email: varchar("email", { length: 256 }).notNull().unique(),
      password: varchar("password", { length: 256 }).notNull(),
      role: varchar("role", { length: 256 }).default("user"),
      photo: varchar("photo", { length: 256 }).default(
        "https://res.cloudinary.com/dgeqvleeq/image/upload/v1691703822/profile_r6ipcc.jpg"
      ),
      verified: boolean("verified").default(false),
      created_at: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updatedAt").defaultNow(),
    });
    ```
15. Create `/src/lib/db/dbTypes.ts` to infer types from the defined tables
    ```ts
    import { InferModel } from "drizzle-orm";
    import { jwt_users } from "./schema/script";
    export type JwtUser = InferModel<typeof jwt_users>; // return type when queried
    export type NewJwtUser = InferModel<typeof jwt_users, "insert">; // insert type
    ```

### Create queries from defined schema

16. Create drizzle configuration file `drizzle.config.ts`
    ```ts
    import type { Config } from "drizzle-kit";
    export default {
      schema: "./src/lib/db/schema/script.ts",
      out: "./drizzle",
    } satisfies Config;
    ```
17. Update `package.json` and add following to `scripts`
    ```json
    "generate": "drizzle-kit generate:pg",
    "drop": "drizzle-kit drop --out=drizzle"
    ```
18. Update `"target": "es5",` to `"target": "ES2022",` in `tsconfig.json`
19. Run following to create queries from schema, this will create a `.sql` file in `drizzle` npm run generate
    ```npm
    npm run generate
    ```

### Setup for running migrations to reflect schema changes on db

20. Install following dependencies to use .env variables
    ```npm
    npm i dotenv
    ```
21. Create `.env` file with the following content
    ```env
    POSTGRES_URL="YOUR_POSTGRES_URL"
    ```
22. Replace content of `drizzle.config.ts` with the following
    ```ts
    import type { Config } from "drizzle-kit";
    import dotenv from "dotenv";
    dotenv.config();
    export default {
      schema: "./src/lib/db/schema/script.ts",
      out: "./drizzle",
      driver: "pg",
      dbCredentials: {
        connectionString: process.env.POSTGRES_URL + "?sslmode=require" || "",
      },
    } satisfies Config;
    ```
23. Follow one of the next two sections to run migrations

### Run Migrations if storage is connected with single application only

- Follow this section only if new storage is created for this application. In case if you are using any storage with some old data or it is connected to some other application too, running the migration this way will update all the tables in the db based on the schema defined in this application. It will delete or modify all other tables from the db which are not defined in the schema. If you are using a storage with some other applications connected to it skip this section and move to next one.

24. create `/src/lib/db/migrate.ts`
    ```ts
    import { migrate } from "drizzle-orm/vercel-postgres/migrator";
    import { db } from "./drizzle";
    await migrate(db, { migrationsFolder: "drizzle" });
    ```
25. Update `package.json` and add following to `scripts`
    ```json
    "migrate": "drizzle-kit push:pg"
    ```
26. Run the migrations
    ```npm
    npm run migrate
    ```

### Run Migrations if storage is connected to multiple applications

- Follow this section if storage is connected to multiple applications. Running migrations this way will not alter any previously stored data in the db. If you already followed the above section skip this one.

27. Install following dependencies
    ```npm
    npm i esbuild-register
    npm i postgres
    ```
28. create `/src/lib/db/migrate.ts` to handle migration
    ```ts
    import { drizzle } from "drizzle-orm/postgres-js";
    import { migrate } from "drizzle-orm/postgres-js/migrator";
    import postgres from "postgres";
    import dotenv from "dotenv";
    dotenv.config();
    const connectionString =
      process.env.POSTGRES_URL + "?sslmode=require" || "";
    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);
    migrate(db, { migrationsFolder: "drizzle" })
      .then((msg) => {
        console.log("Migration successful ===> ", msg);
      })
      .catch((err) => {
        console.log("Migration failed ===> ", err);
      });
    ```
29. Update `package.json` and add following to `scripts`
    ```json
    "migrate": "node -r esbuild-register src/lib/db/migrate.ts"
    ```
30. Run the migrations
    ```npm
    npm run migrate
    ```

### Run drizzle studio

31. Install following to use drizzle studio
    ```npm
    npm i pg
    ```
32. Update `package.json` and add following to `scripts`
    ```json
    "drizzle": "drizzle-kit studio --port 5555"
    ```
33. Run the following to open drizzle studio
    ```npm
    npm run drizzle
    ```
33. Drizzle studio can be accessed at the following link
    ```
    http://127.0.0.1:5555/
    ```
34. Visiting drizzle studio will results in following

    ![drizzle studio](./public/drizzle_studio.png)
