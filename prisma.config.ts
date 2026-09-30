import "dotenv/config";
import { defineConfig } from "prisma/config";

// `migrate deploy` uses DATABASE_URL from .env. Supabase: if the pooler URL (6543) fails
// for DDL, temporarily set DATABASE_URL to the direct Postgres URL (port 5432, session mode)
// from the Supabase dashboard, then run `npm run db:migrate`.

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
