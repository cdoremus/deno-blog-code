/**
 * Demo program showing how to use the versionstamp to keep track of a record's history
 */

import { deleteAllRecords } from "./util.ts";

interface User {
  id: string;
  name: string;
  age: number;
}

interface Email {
  userId: string;
  work?: string;
  home?: string;
}

interface Version {
  versionstamp: string;
  date: number;
}

const kv = await Deno.openKv();

async function persistUser(user: User, email: Email) {
  const userKey = ["users", user.id];
  const emailKey = ["email", user.id];
  const kvUser = kv.get(userKey);
  const kvEmail = kv.get(emailKey);
  const result = await kv.atomic()
    .check({
      key: (await kvUser).key,
      versionstamp: (await kvUser).versionstamp,
    })
    .check({
      key: (await kvEmail).key,
      versionstamp: (await kvEmail).versionstamp,
    })
    .set(userKey, user)
    .set(emailKey, email)
    .commit();

  // Keep track of version in a separate index
  if (result.ok) {
    await kv.set(["user_versionstamp", userId, result.versionstamp], {
      versionstamp: result.versionstamp,
      date: new Date().getTime(),
    });
  }
}

async function displayUserVersions(userId: string) {
  console.log(`Version history of user with id ${userId}`);
  const iter = kv.list<Version>({ prefix: ["user_versionstamp", userId] }, {
    reverse: true,
  });
  for await (const version of iter) {
    // display to stdout here; I'm sure you can do better
    console.log(
      `Version: ${version.value.versionstamp} Date: ${version.value.date}`,
    );
  }
}

// Insert the first record
const userId = crypto.randomUUID();
const user: User = {
  id: userId,
  name: "John Doe",
  age: 22,
};
const email: Email = {
  userId: userId,
  home: "john@doe.com",
  work: "jdoe@foobar.com",
};
// insert user and email into primary index
await persistUser(user, email);

// update the user's name and persist user
const newUser = { ...user, name: "Jane Doe" };
await persistUser(newUser, email);

// print out the two user versions
await displayUserVersions(userId);

// get rid of all records
await deleteAllRecords();
