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

function getIter(cursor: string): Deno.KvListIterator<User> {
  const optionsArg = cursor !== "" ? { limit: 2, cursor } : { limit: 2 };
  const iter = kv.list<User>({ prefix: ["user_by_age"] }, optionsArg);
  return iter;
}

async function printIter(iter: Deno.KvListIterator<User>): Promise<string> {
  for await (const userKv of iter) {
    const user = userKv.value as User;
    console.log(`${user.name}: ${user.age}`);
  }
  return iter.cursor;
}

// display users by age
let cursor = "";
let iter = getIter(cursor);
cursor = await printIter(iter);
while (iter.next()) {
  iter = getIter(cursor);
  cursor = await printIter(iter);
  const result = await iter.next();
  // if (result.done) {
  //   break;
  // }
  console.log("RESULT: ", result);
  // if (result === undefined) {
  //   break;
  // }
}
