/**
 * Keep track of record count using `sum()` when atomically inserting records into KV
 */
import { deleteAllRecords } from "./util.ts";

// get rid of previous records
await deleteAllRecords();

interface User {
  id: number;
  name: string;
  age: number;
}

const users = [
  {
    "id": 1,
    "name": "John Doe",
    "age": 25,
  },
  {
    "id": 2,
    "name": "Emma Smith",
    "age": 32,
  },
  {
    "id": 3,
    "name": "Michael Brown",
    "age": 40,
  },
  {
    "id": 4,
    "name": "Sophia Jackson",
    "age": 19,
  },
  {
    "id": 5,
    "name": "William Davis",
    "age": 37,
  },
  {
    "id": 6,
    "name": "Olivia Miller",
    "age": 22,
  },
  {
    "id": 7,
    "name": "Barbara Jones",
    "age": 17,
  },
  {
    "id": 8,
    "name": "Craig Sampson",
    "age": 33,
  },
];

const kv = await Deno.openKv();
// Insert users and keep track of the count
for (const user of users) {
  const u64 = new Deno.KvU64(1n);
  const result = await kv.atomic()
    // check() not called since this is an insert
    .set(["user", user.id], user)
    .sum(["count"], u64.value) // count incremented by one
    .commit();
  if (!result.ok) {
    throw new Error(`Problem persisting user ${user.name}`);
  }
}

// Retrieve the count from KV
const count = Number((await kv.get(["count"])).value);
console.log("Count: ", count);
console.assert(count === 8);
