/**
 * Using `getMany()` to retrieve all environmental variables stored in separate indexes in a single call.
 */

import { assert } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { deleteAllRecords } from "./util.ts";

await deleteAllRecords();

const kv = await Deno.openKv();

// keys
const githubSecretKey = ["env_var", "GITHUB_ACCESS_KEY"];
const googleSecretKey = ["env_var", "GOOGLE_ACCESS_KEY"];
const discordSecretKey: Deno.KvKey = ["env_var", "DISCORD_ACCESS_KEY"];

// store env vars in separate indexes
await kv.set(discordSecretKey, "password1");
await kv.set(githubSecretKey, "password2");
await kv.set(googleSecretKey, "password3");

// get all env var entries in one call
const envVars = await kv.getMany([
  githubSecretKey,
  googleSecretKey,
  discordSecretKey,
]);

console.log(envVars);
assert(
  envVars[0].key[1] === githubSecretKey[1],
  "Github key does not match expected key value",
);
assert(
  envVars[1].key[1] === googleSecretKey[1],
  "Google key does not match expected key value",
);
assert(
  envVars[2].key[1] === discordSecretKey[1],
  "Discord key does not match expected key value",
);
