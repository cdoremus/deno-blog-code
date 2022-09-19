/**
 * Reading a file with CSV data and convert it to an array of objects.
 * Data will be read from `USERS_FILE` to the console.
 *
 * Run this program inside the processing_csv folder using the command:
 * ```
 * deno run -A ./read_data.ts
 * ```
 */
import { parse } from "https://deno.land/std@0.154.0/encoding/csv.ts";
import { User, USER_COLS, USERS_FILE } from "./constants.ts";

async function readCsvFile(): Promise<User[]> {
  const file = await Deno.readTextFile(USERS_FILE);
  return parse(file,
      {skipFirstRow: true, columns: USER_COLS}
    ) as User[];
}

async function main() {
  const users: User[] = await readCsvFile();
  console.log("USERS: ", users);
}

await main();
