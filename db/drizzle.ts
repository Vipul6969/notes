import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./scheme";

const sql = neon('postgresql://TODO_owner:8fa4yRpbFioZ@ep-blue-unit-a1wb5ubz-pooler.ap-southeast-1.aws.neon.tech/TODO?sslmode=require');

const db = drizzle(sql, { schema: schema });
export default db;
