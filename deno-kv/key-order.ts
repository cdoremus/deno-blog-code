import { showRecords } from "./util.ts";

const objs = [
  {
    id: 1,
    value: "one",
  },
  {
    id: "2",
    value: "two",
  },
  {
    id: 3,
    value: "three",
  },
  {
    id: 4,
    value: "four",
  },
];

const kv = await Deno.openKv();
for await (const obj of objs) {
  kv.set(["nums", obj.id], obj);
}
showRecords(["nums"]);
