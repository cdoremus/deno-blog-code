/**
 * Reading a CSV file with a large/massive amount of data
 * and convert it to objects.
 * Data will be read from `POSTS_FILE` to the console.
 *
 * Run this program inside the processing_csv folder using the command:
 * ```
 * deno run -A ./read_large_data.ts
 * ```
 */
 import { POSTS_FILE, POST_COLS, Post } from "./constants.ts";
import { parse } from "https://deno.land/std@0.154.0/encoding/csv.ts";
import { TextProtoReader } from "https://deno.land/std@0.154.0/textproto/mod.ts";
import { BufReader } from "https://deno.land/std@0.154.0/io/buffer.ts";

async function readLargeCsv() {
  const file = await Deno.open(POSTS_FILE, {read: true});

  const reader = new TextProtoReader(BufReader.create(file));

  let lines = ""
  while (true) {
    const line = await reader.readLine();
    if (line === null) break;
    lines = lines + line + "\n"
  }
  // Convert CSV lines into Post objects
  const record: Post[] = await parse(lines,
    {skipFirstRow: true, columns: POST_COLS}) as Post[]
  //write object array to console
  console.log(record)
}

async function main() {
  await readLargeCsv();
}

await main();