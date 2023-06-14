/**
 *  Demonstrates pagination using Deno KV.
 *
 * The key thing here is to use `iterator.done` to determine that you have reached the last item
 * of a list (@see printIterator).
 */

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

/**
 * Obtains an iterator within a iteration series by calling Deno.Kv.list()` using a "user_by_age" prefix.
 * The start of an iteration series is signalled when the cursor value is an empty string.
 *
 * @param {string} cursor - signals the start of the group you are fetching in this call. The start of
 * iteration is signalled when `cursor` is an empty string.
 * @param {number} limit - the number of items to fetch
 * @param {T} - the generic parameter indicating the type of the item being fetched
 * @returns {Deno.KvListIterator<T>} - iterator over items of T type
 */
function getIterator<T>(
  cursor: string,
  limit: number,
): Deno.KvListIterator<T> {
  const optionsArg = cursor !== "" ? { limit, cursor } : { limit };
  const iterator = kv.list<T>({ prefix: ["user_by_age"] }, optionsArg);
  return iterator;
}

/**
 * Prints `User` object (name and age) contained in an iterator from the call to `getIterator()`
 * to the console.
 *
 * @param {Deno.KvListIterator<T>} iterator - the `User` iterator
 * @param {number} pageNum - the page number being prints
 * @returns
 */
async function printIterator(
  iterator: Deno.KvListIterator<User>,
  pageNum: number,
): Promise<{ cursor: string }> {
  let cursor = "";
  let result = await iter.next();
  const users = [];
  while (!result.done) {
    cursor = iterator.cursor;
    // result.value returns full KvEntry object
    const user = result.value.value as User;
    users.push(user);
    result = await iter.next();
  }
  if (users.length > 0) {
    console.log(`Page ${pageNum}`);
    for (const u of users) {
      console.log(`${u.name} ${u.age}`);
    }
  }
  return { cursor };
}

// print out users in batches of USERS_PER_PAGE
const USERS_PER_PAGE = 3; // aka page size
let pageNum = 1; // in a webapp. this will be a query param
let cursor = ""; // in a webapp. this will be a query param
let iter = getIterator<User>(cursor, USERS_PER_PAGE);
await printIterator(iter, pageNum);
pageNum++; // in a webapp. increment this in the handler
cursor = iter.cursor; // in a webapp, reset this in the handler
while (cursor !== "") {
  iter = getIterator<User>(cursor, USERS_PER_PAGE);
  const iterRet = await printIterator(iter, pageNum);
  cursor = iterRet.cursor;
  pageNum++;
}
