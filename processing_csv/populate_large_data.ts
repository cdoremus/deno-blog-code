/**
 * Populating a CSV file with a large/massive amount of data
 * from the JSONPlaceholder posts API.
 * Data will be written to the `POSTS_FILE`.
 *
 * Run this program inside the processing_csv folder using the command:
 * ```
 * deno run -A ./populate_large_data.ts
 * ```
 *  **NOTE:** Make sure you run this script before you
 *  run the read_large_data.ts script.
 */
import { stringify } from "https://deno.land/std@0.154.0/encoding/csv.ts";
import { Post, POST_COLS, POSTS_URL, POSTS_FILE } from "./constants.ts";


const TOTAL_API_PAGES = 10;
export const SEPARATOR = ",";

async function fetchData(page_number: number): Promise<Post[]> {
  const resp = await fetch(`${POSTS_URL}?_limit=10&_page=${page_number}`);
  return await resp.json();
}

async function writeToFileChunk(posts: Post[]) {
  const file = await Deno.open(POSTS_FILE, {
    append: true
  });
  try {
    const stringified = await stringify(posts, POST_COLS, {headers: false});
    const byteArray = new Uint8Array(stringified.length);
    const encoder = new TextEncoder();
    encoder.encodeInto(stringified, byteArray);
    file.write(byteArray);
  } finally {
    file.close();
  }
}

export async function writeCsvHeader() {
  const header = POST_COLS.join(",");
  await Deno.writeTextFile(POSTS_FILE, `${header}\n`);
}

async function main() {
  // Delete previously written file, if exists
  try {
    await Deno.remove(POSTS_FILE);
  } catch(_e) {
    // ignore, since file probably does not exist
  }
  // write header with object keys first
  await writeCsvHeader();
  // write data
  for (let i = 1; i <= TOTAL_API_PAGES; i++) {
    const users = await fetchData(i);
    // get rid of newlines from body field
    for (const post of users ) {
    // users[i] = cleanNewlines(users[i])
      post.body = post.body.replaceAll('\n', '|')
    }
    await writeToFileChunk(users);
  }
}

await main();