/**
 * This file creates a sqlite database table, inserts data into it,
 * deletes a data record and queries the record
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

function deleteFirstRecord(db: DB) {
  let query;
  try {
    // Delete the first record
    query = db.prepareQuery<[number, string], { name: string; id: number }>(
      `DELETE from people where id=:id`,
    );
    query.all([1]);
  } finally {
    query?.finalize();
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
    console.log("Deleting first record (id=1)");
    deleteFirstRecord(db);
    queryFirstRecord(db);
  } finally {
    // Close connection
    db.close();
  }
}

main();
