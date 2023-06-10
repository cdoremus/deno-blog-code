const kv = await Deno.openKv();
// insert a value
await kv.set(['dino', 'deno'], { name: 'Deno' });
await kv.set(['dino', 'trex'], { name: 'Trex' });
await kv.set(['dino', 'velo'], { name: 'Velociraptor' });


// get a value
const valor = await kv.get(['dino', 'deno'])


// list key/values
for await (const entry of kv.list({ prefix: ["dino"] })) {
  console.log(entry.key);
  console.log(entry.value);
}

// read a list that starts with the same prefix
for await (const entry of kv.list({ prefix: ["users"] })) {
  console.log(entry.key);
  console.log(entry.value);
}

// versioning is done when values are overwritten
// `versionstamp` is the versioning field
const db = await Deno.openKv()
const craig = await db.set(["users", "craig"], "Craig");
console.log("craig", craig);
const scott = await db.set(["users", "scott"], "Scott");
console.log("scott", scott);
const results = await db.getMany([['users', 'craig'], ['users', 'scott']])
console.log(results[0].versionstamp) // "00000000000000010000"
console.log(results[1].versionstamp) // null
