
import "dotenv/config";
import type {Config} from "drizzle-kit";
 
export default {
  schema: "./db/scheme.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;