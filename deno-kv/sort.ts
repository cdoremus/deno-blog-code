import { deleteAllRecords, showRecords } from "./util.ts";

// User type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// An array of example users
const users: User[] = [
  {
    id: crypto.randomUUID(),
    name: "John Dow",
    email: "john@example.com",
    role: "user"
  },
  {
    id: crypto.randomUUID(),
    name: "Barbara Bowie",
    email: "barb@example.com",
    role: "user"
  },
  {
    id: crypto.randomUUID(),
    name: "Jane Dow",
    email: "jane@example.com",
    role: "user"
  },
  {
    id: crypto.randomUUID(),
    name: "Annie Anderson",
    email: "annie@example.com",
    role: "user"
  },
  {
    id: crypto.randomUUID(),
    name: "Fred Foobar",
    email: "jack@example.com",
    role: "admin"
  },
]


console.log("DELETE ALL PREVIOUS RECORDS")
await deleteAllRecords()
// open a connection to Deno KV
const kv = await Deno.openKv();

// create a `user` index
for await(const user of users) {
  kv.set(["users", user.id], user);
}
console.log("SHOW USERS");
await showRecords(["users"]);

// create a `user_by_name` index for sorting
for await(const user of users) {
  const name = user.name.split(" ");
  kv.set(["user_by_name", name[1], name[0]], user);
}
console.log("SORT BY LAST NAME");
await showRecords(["user_by_name"]);

