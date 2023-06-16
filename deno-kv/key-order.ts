/**
 * Shows how KV keys are ordered
 *
 * @see https://deno.com/manual@v1.34.0/runtime/kv/key_space#key-part-ordering
 */
import { deleteRecords, showRecords } from "./util.ts";

await deleteRecords(["nums"]);

interface Numbers {
  id: string | number | Uint8Array;
  value: string;
}
const numbers = [
  {
    id: 3,
    value: "three",
  },
  {
    id: 1,
    value: "one",
  },
  {
    id: 4,
    value: "four",
  },
  {
    id: "2",
    value: "two",
  },
  {
    id: new Uint8Array(9),
    value: "nine",
  },
];

const kv = await Deno.openKv();
for await (const num of numbers) {
  kv.set(["nums", num.id], num);
}

// Retrieve and console print all records.
// Note that `Uint8Array(9)` is printed first,
// followed by the string id "2",
// then the numbers in numerical order.
await showRecords<Numbers>(["nums"], ["id", "value"]);
