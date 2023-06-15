/**
 *  Demonstrates pagination using Deno KV.
 *
 * The key thing here is to use `iterator.done` to determine that you have reached the last item
 * of a list (@see processIterator).
 */

import { deleteAllRecords } from "./util.ts";

const kv = await Deno.openKv();

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

// Insert users in two KV indexes; one by id, the other by age
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
 * Obtains an iterator within a iteration series done by calling `Deno.Kv.list()` multiple times during
 * pagination. The start of an iteration series is signalled when the cursor value is an empty string.
 *
 * @param {string} cursor - signals where is a group of results you currently are located. The start of
 * iteration is signalled when `cursor` is an empty string.
 * @param {number} limit - the number of items per iteration
 * @param {Deno.KvKeyPart} - the prefix `list()` argument per iteration
 * @param {T} - the generic parameter indicating the type of the item being iterated
 * @returns {Deno.KvListIterator<T>} - an iterator over items of T type
 */
function getIterator<T>(
  cursor: string,
  limit: number,
  prefix: Deno.KvKeyPart[],
): Deno.KvListIterator<T> {
  const optionsArg = cursor !== "" ? { limit, cursor } : { limit };
  const iterator = kv.list<T>({ prefix }, optionsArg);
  return iterator;
}

/**
 * Pulls out the data (items) contained in an iterator from a call to `getIterator()`
 * and returns them with the latest cursor string.
 *
 * @param {T} - the type being iterated
 * @param {Deno.KvListIterator<T>} iterator - the item iterator
 * @returns {{ cursor: string; items: T[] }}
 */
async function processIterator<T>(
  iterator: Deno.KvListIterator<T>,
): Promise<{ cursor: string; items: T[] }> {
  let cursor = "";
  let result = await iter.next();
  const items: T[] = [];
  while (!result.done) {
    cursor = iterator.cursor;
    // result.value returns full KvEntry object
    const item = result.value.value;
    items.push(item as T);
    result = await iter.next();
  }
  return { cursor, items };
}

/**
 * Prints `User` objects (name and age) with the page number to the console.
 *
 * @param users - the users to be printed
 * @param {number} pageNum - the page number to be printed
 */
function printUsers(users: User[], pageNum: number) {
  console.log(`Page ${pageNum}`);
  for (const u of users) {
    console.log(`${u.name} ${u.age}`);
  }
}

// print out users in batches of USERS_PER_PAGE
const USERS_PER_PAGE = 3; // aka page size
const keyPart = ["user_by_age"]; // index key to sort users by age
let pageNum = 1; // in a webapp, this will be a query param
let cursor = ""; // in a webapp, this will be a query param
let iter = getIterator<User>(cursor, USERS_PER_PAGE, keyPart);
const processedItems = await processIterator(iter);
printUsers(processedItems.items as User[], pageNum);
pageNum++; // in a webapp. increment this in the handler for query param
cursor = processedItems.cursor; // in a webapp, set this in the handler for query param
while (cursor !== "") {
  iter = getIterator<User>(cursor, USERS_PER_PAGE, keyPart);
  const iterRet = await processIterator<User>(iter);
  cursor = iterRet.cursor;
  const items: User[] = iterRet.items as User[];
  if (items.length > 0) {
    printUsers(items, pageNum);
  }
  pageNum++;
}
