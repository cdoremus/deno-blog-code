import { deleteAllRecords } from "./util.ts";

const kv = await Deno.openKv();

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

// Insert users in a KV index
for (const user of users) {
  const result = await kv.atomic()
    // check() calls omitted
    .set(["user", user.id], user)
    .set(["user_by_age", user.age, user.id], user)
    .commit();
  if (!result.ok) {
    throw new Error(`Problem persisting user ${user.name}`);
  }
}

function getIterator(cursor: string, limit = 2): Deno.KvListIterator<User> {
  const optionsArg = cursor !== "" ? { limit, cursor } : { limit: 2 };
  const iter = kv.list<User>({ prefix: ["user_by_age"] }, optionsArg);
  return iter;
}

async function printIterator(
  iter: Deno.KvListIterator<User>,
): Promise<{ cursor: string; found: boolean }> {
  let found = false;
  let cursor = "";
  let result = await iter.next();
  while (!result.done) {
    cursor = iter.cursor;
    // result.value returns full KvEntry object
    const user = result.value.value as User;
    console.log(`${user.name}: ${user.age}`);
    found = true;
    result = await iter.next();
  }
  return { cursor, found };
}

// print out users in batches of two
let cursor = "";
let iter = getIterator(cursor);
await printIterator(iter);
cursor = iter.cursor;
while (true) {
  iter = getIterator(cursor);
  const iterRet = await printIterator(iter);
  cursor = iterRet.cursor;
  if (!iterRet.found) break;
}
