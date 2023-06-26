/**
 * Demonstrating KV queueing via `Deno.Kv.enqueue()` and `Deno.Kv.listenQueue()`.
 *
 * You will need to Ctrl-C to stop the program since the listeners are
 * always active while the program runs.
 */
import { deleteAllRecords } from "./util.ts";

interface QueueMessage {
  key: Deno.KvKey;
  value: unknown;
}

await deleteAllRecords();

const kv = await Deno.openKv();

kv.listenQueue(async (msg: unknown) => {
  const queueMsg = msg as QueueMessage;
  console.log("Queued Msg: ", queueMsg);
  await kv.set(queueMsg.key, queueMsg.value);
  console.log("Value delivered: ", queueMsg);
});

// Enqueue first message
const res = await kv.enqueue(
  { key: ["test1"], value: "testing 1,2,3" },
  {
    delay: 1000,
    keysIfUndelivered: [["queue_failed", "test1`"], ["queue_failed", "test2"]],
  },
);
console.log("Queue result 1: ", res);

let msg1 = await kv.get(["test1"]);

console.log(`Enqueued value 1: ${JSON.stringify(msg1)}`);

// Enqueue second message
await kv.enqueue(
  { key: ["test1"], value: "testing 4,5,6" },
  {
    delay: 1000,
    keysIfUndelivered: [["queue_failed", "test3`"], ["queue_failed", "test4"]],
  },
);

console.log("Queue result 2: ", res);

msg1 = await kv.get(["test1"]);

console.log(`Enqueued value 2: ${JSON.stringify(msg1)}`);
