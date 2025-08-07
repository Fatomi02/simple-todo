// deno-lint-ignore-file
import { MongoClient } from "npm:mongodb";

const MONGODB_URL = Deno.env.get("MONGODB_URL");

let db: any;
if (!MONGODB_URL) {
  throw new Error("❌ MONGODB_URL not found in environment variables.");
}

const client = new MongoClient(MONGODB_URL);
await client.connect();

async function createMongoDBConnection() {
  try {
    console.log("Connected to MongoDB");
    return client.db("todoApp");
  } catch (error) {
    throw new Error(`Failed to connect to MongoDB: ${error}`);
  }
}

db = await createMongoDBConnection();
export { db };
