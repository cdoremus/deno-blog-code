/**
 * Show how to create a sorting secondary index
 */
import { deleteAllRecords, showRecords } from "./util.ts";

// User type
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// An array of example users
const users: User[] = [
  {
    id: crypto.randomUUID(),
    firstName: "John",
    lastName: "Dow",
    email: "john@example.com",
    role: "user",
  },
  {
    id: crypto.randomUUID(),
    firstName: "Barbara",
    lastName: "Bowie",
    email: "barb@example.com",
    role: "user",
  },
  {
    id: crypto.randomUUID(),
    firstName: "Jane",
    lastName: "Dow",
    email: "jane@example.com",
    role: "user",
  },
  {
    id: crypto.randomUUID(),
    firstName: "Annie",
    lastName: "Anderson",
    email: "annie@example.com",
    role: "user",
  },
  {
    id: crypto.randomUUID(),
    firstName: "Fred",
    lastName: "Foobar",
    email: "fredk@example.com",
    role: "admin",
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
    .set(["user_by_name", user.lastName, user.firstName], user) // secondary sorting index
    .commit();
}

console.log("UNSORTED USERS");
await showRecords<User>(["users"], ["firstName", "lastName"]);
console.log("SORTED BY NAME");
await showRecords<User>(["user_by_name"], ["firstName", "lastName"]);
