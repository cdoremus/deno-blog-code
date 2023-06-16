/**
 * Sorting records with duplicates. In this case, we want to sort by name but there are duplicate names
 * so we add the id to the sort key so that all of the duplicates will be presented in the results.
 * If the id were not part of the sort key, only the first record in the index will be processed.
 * See the last two console prints for a demonstration.
 */
import { deleteAllRecords, showRecords } from "./util.ts";

// User type
interface User {
  id: string;
  lastName: string;
  firstName: string;
}

// An array of example users
const users: User[] = [
  {
    id: crypto.randomUUID(),
    lastName: "Smith",
    firstName: "John",
  },
  {
    id: crypto.randomUUID(),
    lastName: "Dow",
    firstName: "Josephine",
  },
  {
    id: crypto.randomUUID(),
    lastName: "Smith",
    firstName: "Jackie",
  },
  {
    id: crypto.randomUUID(),
    lastName: "Smith",
    firstName: "Jean",
  },
  {
    id: crypto.randomUUID(),
    lastName: "Dow",
    firstName: "Joe",
  },
  {
    id: crypto.randomUUID(),
    lastName: "Smith",
    firstName: "Jean",
  },
];

console.log("DELETE ALL PREVIOUS RECORDS");
await deleteAllRecords();

// open a connection to Deno KV
const kv = await Deno.openKv();

for await (const user of users) {
  await kv.atomic()
    // no checks sorry!
    .set(["users", user.id], user) // primary index
    .set(["sort_by_full_name", user.lastName, user.firstName], user) // secondary sorting index
    .set(["sort_by_last_name_id", user.lastName, user.id], user) // secondary sorting index
    .set(["sort_by_last_name", user.lastName], user) // broken secondary sorting index
    .commit();
}

console.log("SHOW UNSORTED USERS");
await showRecords<User>(["users"], ["firstName", "lastName", "id"]);
console.log("USERS SORT BY LAST AND FIRST NAME WITH ID");
await showRecords<User>(["sort_by_full_name"], ["firstName", "lastName", "id"]);
console.log("USERS SORT BY LAST NAME WITH ID");
await showRecords<User>(["sort_by_last_name_id"], [
  "firstName",
  "lastName",
  "id",
]);
// create a `sort_by_last_name` index for sort by last name
// NOTE: The duplicates are missed and not printed out
console.log("USER SORT BY LAST NAME WITHOUT ID");
await showRecords<User>(["sort_by_last_name"], ["firstName", "lastName", "id"]);
