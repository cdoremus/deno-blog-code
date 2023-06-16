import { deleteAllRecords } from "./util.ts";

interface Deferred<T> extends Promise<T> {
  readonly state: "pending" | "fulfilled" | "rejected";
  resolve(value?: T | PromiseLike<T>): void;
  // deno-lint-ignore no-explicit-any
  reject(reason?: any): void;
}

function deferred<T>(): Deferred<T> {
  let methods;
  let state = "pending";
  const promise = new Promise<T>((resolve, reject): void => {
    methods = {
      async resolve(value: T | PromiseLike<T>) {
        await value;
        state = "fulfilled";
        resolve(value);
      },
      // deno-lint-ignore no-explicit-any
      reject(reason?: any) {
        state = "rejected";
        reject(reason);
      },
    };
  });
  Object.defineProperty(promise, "state", { get: () => state });
  return Object.assign(promise, methods) as Deferred<T>;
}

await deleteAllRecords();

const kv = await Deno.openKv();
const promise = deferred();

kv.listenQueue(async (msg: unknown) => {
  await kv.set(["foo"], msg);
  console.log("Message delivered: ", msg);
  promise.resolve();
});

const res = await kv.enqueue(
  "foobar", /*, {
  delay: 1000,
  keysIfUndelivered: [["queue_failed", "a"], ["queue_failed", "b"]],
}*/
);
console.log("Queue result: ", res);

const msg1 = await kv.get(["foo"]);

console.log(`Enqueued message 1: ${JSON.stringify(msg1)}`);

await kv.enqueue(
  "baz!!",
  {
    delay: 1000,
    keysIfUndelivered: [["queue_failed", "a"], ["queue_failed", "b"]],
  },
);

kv.close(); // needed otherwise the console hangs because queue listener is still listening

const kv2 = await Deno.openKv();

const msg2 = await kv2.get(["foo"]);

console.log(`Enqueued message 2: ${JSON.stringify(msg2)}`);
