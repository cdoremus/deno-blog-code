import { assert } from "https://deno.land/std@0.153.0/testing/asserts.ts";
const kv = await Deno.openKv();

// Get rid of old values
await kv.delete(["sum"])
await kv.delete(["min"])
await kv.delete(["max"])

// sum
for (let i=1;i<=10;i++) {
  const u64 = new Deno.KvU64(BigInt(i));
  await kv.atomic().sum(["sum"], u64.value ).commit();
}

const sum = await kv.get(["sum"])
const sumU64 = sum.value as Deno.KvU64;
const valSumU64 = sumU64.value
console.log(valSumU64);
await kv.delete(["sum"])

assert( valSumU64 === 55n, `Sum '${valSumU64}' not correct`);


// min and max
for (let i=1;i<=10;i++) {
  const val = BigInt(Math.floor(Math.random() * 100) )
  await kv.atomic().max(["max"], val).commit();
  await kv.atomic().min(["min"], val).commit();
  // await
}

console.log("Min: ", await kv.get(["min"]));
console.log("Max: ", await kv.get(["max"]));

