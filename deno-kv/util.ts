export const showAllRecords = async (): Promise<void> => {
  const kv = await Deno.openKv();
  const rows = kv.list({ prefix: [] });
  for await (const row of rows) {
    console.log(JSON.stringify(row));
  }
};

export const showRecords = async (keyPrefix: Deno.KvKey): Promise<void> => {
  const kv = await Deno.openKv();
  const rows = kv.list({ prefix: keyPrefix });
  for await (const row of rows) {
    console.log(JSON.stringify(row));
  }
};

export const deleteAllRecords = async (): Promise<void> => {
  const kv = await Deno.openKv();
  const rows = kv.list({ prefix: [] });
  for await (const row of rows) {
    kv.delete(row.key);
  }
};

export const deleteRecords = async (keyPrefix: Deno.KvKey): Promise<void> => {
  const kv = await Deno.openKv();
  const rows = kv.list({ prefix: keyPrefix });
  for await (const row of rows) {
    kv.delete(row.key);
  }
};
