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

// fetch batch of 2 by default
function getIterator(cursor: string, limit = 2): Deno.KvListIterator<User> {
  const optionsArg = cursor !== "" ? { limit, cursor } : { limit };
  const iter = kv.list<User>({ prefix: ["user_by_age"] }, optionsArg);
  return iter;
}

async function printIterator(
  iterator: Deno.KvListIterator<User>,
  pageNum: number,
): Promise<{ cursor: string; found: boolean }> {
  let found = false;
  let cursor = "";
  let result = await iter.next();
  const users = [];
  while (!result.done) {
    cursor = iterator.cursor;
    // result.value returns full KvEntry object
    const user = result.value.value as User;
    users.push(user);
    // are there records affiliated with the iterator
    found = true;
    result = await iter.next();
  }
  if (users.length > 0) {
    console.log(`Page ${pageNum}`);
    for (const u of users) {
      console.log(`${u.name} ${u.age}`);
    }
  }
  return { cursor, found };
}

// print out users in batches of two
const USERS_PER_PAGE = 3;
let pageNum = 1;
let cursor = "";
let iter = getIterator(cursor, USERS_PER_PAGE);
await printIterator(iter, pageNum);
pageNum++;
cursor = iter.cursor;
while (true) {
  iter = getIterator(cursor, USERS_PER_PAGE);
  const iterRet = await printIterator(iter, pageNum);
  cursor = iterRet.cursor;
  if (!iterRet.found) break;
  pageNum++;
}
