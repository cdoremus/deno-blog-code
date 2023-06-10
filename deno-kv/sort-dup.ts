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

// create a `user` primary index
for await (const user of users) {
  kv.set(["users", user.id], user);
}
console.log("SHOW UNSORTED USERS");
await showRecords(["users"]);

// create a `sort_by_full_name` index for full (last+first) name sorting
for await (const user of users) {
  kv.set(["sort_by_full_name", user.lastName, user.firstName, user.id], user);
}
console.log("USERS SORT BY LAST AND FIRST NAME");
await showRecords(["sort_by_full_name"]);

// create a `sort_by_last_name` index for sort by last name
for await (const user of users) {
  kv.set(["sort_by_last_name", user.lastName, user.id], user);
}
console.log("USERS SORT BY LAST NAME");
await showRecords(["sort_by_last_name"]);
