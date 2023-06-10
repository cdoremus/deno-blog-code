import { deleteAllRecords, showAllRecords } from "./util.ts";

/**
 * The `atomic` method is transactional, assuring the synchronization between multiple
 * related KV indexes.
 */
const kv = await Deno.openKv();

interface BaseUser {
  id: string;
  name: string;
  email: string;
}

interface User extends BaseUser {
  age: number;
  address?: Address;
  phones?: Phone;
}

type Address = {
  userId?: string;
  streetNumber: string;
  street: string;
  city: string;
  state: string;
  zipCode?: string;
};

type Phone = {
  cell?: string;
  home?: string;
  work?: string;
};

const KeyRoot = {
  users: "users",
  userEmail: "userEmail",
  UserAddresses: "userAddress",
  phones: "phones",
};

const createUserWithAddressAndPhone = async (
  user: User,
  address: Address,
  phone: Phone,
): Promise<Deno.KvCommitResult | Deno.KvCommitError> => {
  const userId = crypto.randomUUID();
  user.id = userId;

  // get data for atomic check
  const guser = await kv.get([KeyRoot.users, userId]);
  const userEmail = await kv.get([KeyRoot.userEmail, user.email]);
  const userAddress = await kv.get([KeyRoot.UserAddresses, userId]);
  const userPhone = await kv.get([KeyRoot.phones, userId]);

  const result = await kv.atomic()
    .check(guser)
    .check(userEmail)
    .check(userAddress)
    .check(userPhone)
    .set([KeyRoot.users, userId], user)
    .set([KeyRoot.userEmail, user.email], user)
    .set([KeyRoot.UserAddresses, userId], address)
    .set([KeyRoot.phones, userId], phone)
    .commit();
  return result;
};

const findUserByEmail = async (email: string): Promise<BaseUser> => {
  const key = [KeyRoot.userEmail, email];
  const user = await kv.get(key);
  const userVal = user.value as BaseUser;
  return userVal;
};

const findUserWithAddressAndPhone = async (userId: string): Promise<User> => {
  const userKv = await kv.get([KeyRoot.users, userId]);
  kv.atomic()
    .check(userKv);

  const user = userKv.value as User;
  const addressKv = await kv.get([KeyRoot.UserAddresses, userId]);
  const address = addressKv.value as Address;
  user.address = address;
  const phoneKv = await kv.get([KeyRoot.phones, userId]);
  user.phones = phoneKv.value as Phone;
  return user;
};

// Add some data
const user1: User = {
  id: "",
  name: "John Doe",
  age: 32,
  email: "jdoe@foo.com",
};
const addr1: Address = {
  streetNumber: "100",
  street: "Main Street",
  city: "Bethel",
  state: "ME",
  zipCode: "04260",
};
const phone1: Phone = { cell: "2071231234" };
const createResult = await createUserWithAddressAndPhone(user1, addr1, phone1);
// make sure commit() succeeds
if (!createResult.ok) {
  console.error(
    "There was a problem! User, address & phone persistence did not work.",
  );
}

// const user2: User = {
//   id: "",
//   name: "Bill Smith",
//   age: 34,
//   email: "bsmith@foo.com",
// };
// const addr2: Address = {
//   streetNumber: "1001",
//   street: "Mass Avenue",
//   city: "Boston",
//   state: "MA",
//   zipCode: "02108",
// };
// const phone2: Phone = { cell: "5180987654", home: "2123456789" };

// await createUserWithAddressAndPhone(user2, addr2, phone2);
// const user = await findUserByEmail("bsmith@foo.com");
// const userAddress = await findUserWithAddressAndPhone(user.id);
// console.log(`USER FOUND: ${JSON.stringify(userAddress)}`);

console.log("Records inserted");
await showAllRecords();

await deleteAllRecords();
