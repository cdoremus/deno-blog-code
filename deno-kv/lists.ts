import { deleteAllRecords, showAllRecords, showRecords } from "./util.ts";
/**
 * Querying multiple records using list and getMany
 */

// User type
interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

type Role = "user" | "admin";

// An array of example users
const users: User[] = [
  {
    id: crypto.randomUUID(),
    name: "John Dow",
    email: "john@example.com",
    role: "user",
  },
  {
    id: crypto.randomUUID(),
    name: "Barbara Bowie",
    email: "barb@example.com",
    role: "user",
  },
  {
    id: crypto.randomUUID(),
    name: "Jane Dandy",
    email: "jane@example.com",
    role: "user",
  },
  {
    id: crypto.randomUUID(),
    name: "Annie Anderson",
    email: "annie@example.com",
    role: "user",
  },
  {
    id: crypto.randomUUID(),
    name: "Fred Smith",
    email: "fred@example.com",
    role: "admin",
  },
  {
    id: crypto.randomUUID(),
    name: "Zeke Zozos",
    email: "zeke@example.com",
    role: "user",
  },
];

console.log("DELETE ALL PREVIOUS RECORDS");
await deleteAllRecords();
// open a connection to Deno KV
const kv = await Deno.openKv();

// Use role as key value
for await (const user of users) {
  kv.set(["users", user.role, user.id], user);
}

// Get users with the 'user' role
console.log("USER ROLE");
await showRecords(["users", "user"]);

// Get users with the 'admin' role
console.log("ADMIN ROLE");
await showRecords(["users", "admin"]);

// Using 'start' and 'end' as a list argument

// create a `user_by_name` index
for await (const user of users) {
  const name = user.name.split(" ");
  const fname = name[0]?.trim() ?? "";
  const lname = name[1]?.trim() ?? "";
  kv.set(["user_by_name", lname, fname], user);
}

console.log("USERS FROM DOW TO ZOZOS");
const rows = kv.list({
  start: ["user_by_name", "Dow"],
  end: ["user_by_name", "Zozos"],
});
for await (const row of rows) {
  console.log(JSON.stringify(row));
}
