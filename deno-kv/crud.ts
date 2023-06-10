/**
 * Basic CRUD operations in Deno KV
 */

// User type
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
}

// An example user
const userId = crypto.randomUUID();
const user: User = {
  id: userId,
  name: "John Doe",
  email: "john@doe.com",
  phone: "2071231234",
  age:35
}

/*************** CRUD Operations **************/

// open a connection to Deno KV
const kv = await Deno.openKv();


// insert (create) a user into the KV data store
const insertUser = async (user: User): Promise<Deno.KvCommitResult> => {
  const result = await kv.set(["users", userId], user);
  return result;
}

// Read record from KV
const getUser = async (id: string): Promise<Deno.KvEntryMaybe<User> | null> => {
  const user = await kv.get<User>(["users", id ]);
  console.log(`User with ID ${id} in KV: \n`, JSON.stringify(user));
  return user;
}

// update the user object
user.phone = "2071239876";
const updatedUser = async (user: User): Promise<Deno.KvCommitResult> => {
  const result = await kv.set(["users", userId], user);
  return result;
}

const deleteUser = async (userId: string): Promise<void> => {
  await kv.delete(["users", userId]);
}


// Create (Insert)
insertUser(user);
const newUser = await getUser(user.id);
console.log("User Inserted: \n", JSON.stringify(newUser));
user.phone = "2071239876";

// Read

// Update
updatedUser(user);
const updated = await getUser(user.id);
console.log(`User with ID ${userId} in KV: \n`, JSON.stringify(updated));

// Delete
console.log(`Deleting user with ID ${userId} in KV: \n`, JSON.stringify(updated));
deleteUser(user.id);

//
console.table(`\n\n\nTABLE: \n\n\n ${[JSON.stringify((updated?.value as User))]}`);
