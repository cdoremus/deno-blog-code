const kv = await Deno.openKv();

const MAX_INT = 50;
const ITER_LIMIT = 10;
const KV_SQUARE_ROOT_KEY = "squareRoots";


type SquareRoot = {
  id: string;
  integer: number;
  squareRoot: number;
}
// Delete old values
await kv.delete([KV_SQUARE_ROOT_KEY]);

// Load values into KV
for (let i = 1; i <= MAX_INT; i++) {
  const id = crypto.randomUUID();
  const squareRoot = Math.sqrt(i);
  const root: SquareRoot = {id, integer: i, squareRoot}
  await kv.set([KV_SQUARE_ROOT_KEY, id], root);
  // console.log(`Square root of ${i} loaded`);
}

// const arr = await kv.get([KV_SQUARE_ROOT_KEY]);
// console.log(arr)

let iter = await kv.list({prefix: [KV_SQUARE_ROOT_KEY]}, {limit: ITER_LIMIT})
for await (const root of iter) {
  // console.log(`SquareRoot: ${root} loaded`);
  const squareRoot: SquareRoot = root.value as SquareRoot;
  console.log(`${squareRoot.integer}: ${squareRoot.squareRoot}`)
}


// iter = await kv.list({prefix: [KV_SQUARE_ROOT_KEY]}, {limit: ITER_LIMIT, cursor: iter.cursor})
// for await (const root of iter) {
//   const squareRoot: SquareRoot = root.value as SquareRoot;
//   console.log(`${squareRoot.integer}: ${squareRoot.squareRoot}`)
// }


// const showIngroups = async (iter) => {
//   for await (const root of iter) {
//     console.table(root.value)
//   }
// }


