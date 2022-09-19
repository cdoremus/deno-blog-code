/**
 * Populating a CSV file with a small amount of data
 * from the JSONPlaceholder users API.
 * Data will be written to the `USERS_FILE`.
 *
 * Run this program inside the processing_csv folder using the command:
 * ```
 * deno run -A ./populate_data.ts
 * ```
 *  **NOTE:** Make sure you run this script before you
 *  run the read_data.ts script.
 */
import { stringify } from "https://deno.land/std@0.154.0/encoding/csv.ts";
import { USERS_FILE, USERS_URL, USER_COLS, User } from "./constants.ts";


async function fetchData(): Promise<User[]> {
  const resp = await fetch(USERS_URL);
  return await resp.json();
}

async function writeToFile(users: User[]): Promise<void> {
  console.log("USERS", users);
  console.log("LEN", users.length);
  const stringified = await stringify(users, USER_COLS);
  await Deno.writeTextFile(USERS_FILE, stringified);
}

async function main() {
  // Delete previously written file, if exists
  try {
    await Deno.remove(USERS_FILE);
  } catch(_e) {
    // ignore, since file probably does not exist
  }
  const users = await fetchData();
  writeToFile(users);
}

await main();