/**
 * Utility functions
 */

export const showAllRecords = async (): Promise<void> => {
  const kv = await Deno.openKv();
  const rows = kv.list({ prefix: [] });
  for await (const row of rows) {
    console.log(row);
  }
};

/**
 * Console print records using a index prefix and optionally a list of fields to print out
 *
 * @param T {extends Object} - Object to be printed
 * @param { Deno.KvKey} keyPrefix - key prefix for `list()` call
 * @param {string[]} - fields Object fields to print with values
 */
export const showRecords = async <T extends Object>(
  keyPrefix: Deno.KvKey,
  fields?: string[],
): Promise<void> => {
  const kv = await Deno.openKv();
  const rows = kv.list<T>({ prefix: keyPrefix });
  for await (const row of rows) {
    const value = row.value;
    if (fields && typeof value === "object") {
      let objVals = "";
      for (const field of fields) {
        // @ts-ignore 'val not an Object' errors
        objVals = objVals + `${field}: ${value[field]}; `;
      }
      console.log(objVals);
    } else {
      console.log(row);
    }
  }
};

export const printIteratorValues = async <T>(
  iterator: Deno.KvListIterator<T>,
) => {
  for await (const userKv of iterator) {
    const item = userKv.value;
    console.log(item);
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
