/**
 * This file creates a sqlite database table, inserts data into it,
 * updates a data record queries the record
 * before and after the update
 * using the deno-sqlite library.
 */
import { DB } from "deno-sqlite";

function insert(db: DB): void {
  db.execute(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
      )
    `);

  // Insert data
  for (const name of ["Peter Parker", "Clark Kent", "Bruce Wayne"]) {
    db.query("INSERT INTO people (name) VALUES (?)", [name]);
  }
}

function update(db: DB) {
  let query;
  try {
    // DO an update on the first record
    const newName = "Wade Winston Wilson";
    query = db.prepareQuery<[number, string], { name: string; id: number }>(
      `UPDATE people set name=? where id=:id`,
    );
    query.all([newName, 1]);
    query.finalize();
    query = null;
  } finally {
    if (query) {
      query.finalize();
    }
  }
}

function queryFirstRecord(db: DB) {
  let query;
  try {
    query = db.prepareQuery<[number, string], { name: string; id: number }>(
      "SELECT id, name FROM people where id=:id",
    );
    const row = query.all([1]);
    console.log(`Updated row for id=1`, row);
  } finally {
    query?.finalize();
  }
}

function main() {
  // Open a database
  // const db: DB = new DB("test.db");
  const db: DB = new DB(":memory:");
  try {
    insert(db);
    queryFirstRecord(db);
    update(db);
    queryFirstRecord(db);
  } finally {
    // Close connection
    db.close();
  }
}

main();
