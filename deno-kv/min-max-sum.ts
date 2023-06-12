import { assert } from "https://deno.land/std@0.153.0/testing/asserts.ts";
const kv = await Deno.openKv();

const deleteOldData = async () => {
  await kv.delete(["sum"]);
  await kv.delete(["min"]);
  await kv.delete(["max"]);
};

// Get rid of old indexes
await deleteOldData();

// sum of integers between 1 to 10
for (let i = 1; i <= 10; i++) {
  const u64 = new Deno.KvU64(BigInt(i));
  await kv.atomic().sum(["sum"], u64.value).commit();
}

const sum = await kv.get(["sum"]);
const sumU64 = sum.value as Deno.KvU64;
const valSumU64 = sumU64.value;
console.log(`Sum of 1 to 10: ${valSumU64}`);
assert(valSumU64 === 55n, `Sum '${valSumU64}' not correct`);

// min and max of 10 random numbers
console.log("Ten random numbers between 1 and 100");
for (let i = 1; i <= 10; i++) {
  // generate random number
  const val = BigInt(Math.floor(Math.random() * 100));
  console.log(Number(val)); // convert bigint to number
  await kv.atomic().max(["max"], val).commit();
  await kv.atomic().min(["min"], val).commit();
}

console.log(
  "Smallest of 10 random numbers: ",
  Number((await kv.get(["min"]) as Deno.KvEntry<Deno.KvU64>).value.value),
);
console.log(
  "Largest of 10 random numbers: ",
  Number((await kv.get(["max"]) as Deno.KvEntry<bigint>).value),
);

// Get rid of old indexes
await deleteOldData();

//shopping cart item
interface CartItem {
  userId: string;
  itemDesc: string;
  price: number;
}

const cart: CartItem[] = [
  { userId: "100", itemDesc: "Arduino Uno kit", price: 60 },
  { userId: "100", itemDesc: "Temp sensor", price: 10 },
  { userId: "100", itemDesc: "Humidity sensor", price: 15 },
  { userId: "100", itemDesc: "Power cord with 5V regulator", price: 18 },
  { userId: "100", itemDesc: "Servo", price: 8 },
];

// add data to indexes
for (const item of cart) {
  kv.atomic()
    .set(["cart", item.userId], item) // primary index
    .min(["cart_min"], BigInt(item.price))
    .max(["cart_max"], BigInt(item.price))
    .sum(["cart_sum"], BigInt(item.price))
    .commit();
}

const cartMin = await kv.get(["cart_min"]);
const cartMax = await kv.get(["cart_max"]);
const cartSum = await kv.get(["cart_sum"]);

console.log("Shopping cart data");
console.log(`Min price: ${(cartMin as Deno.KvEntry<bigint>).value}`);
console.log(`Max price: ${(cartMax as Deno.KvEntry<bigint>).value}`);
console.log(`Total price: ${(cartSum as Deno.KvEntry<bigint>).value}`);
