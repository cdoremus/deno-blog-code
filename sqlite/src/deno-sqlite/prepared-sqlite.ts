/**
 * This file creates a sqlite database table, inserts data into it
 * and queries a data record using the
 * prepareQuery function
 * using the deno-sqlite library.
 */
import { DB } from "deno-sqlite";

function run(db: DB): void {
  let query;
  try {
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

    // Print out records using
    // a prepared statement
    query = db.prepareQuery<[number, string], { name: string; id: number }>(
      "SELECT id, name FROM people where id=:id",
    );
    // bind parameter and return record
    let row = query.all([1]);
    console.log(`Row for id=1`, row);
    row = query.all({ "id": 3 });
    // print out first record
    console.log(`Row for id=3`, row[0]);
    // Should show an empty array
    row = query.all({ "id": 30 });
    console.log(`Row for id=30 that does not exist`, row);
  } finally {
    if (query) {
      query.finalize();
    }
  }
}

function main() {
  // Open a database
  // const db: DB = new DB("test.db");
  const db: DB = new DB(":memory:");
  try {
    run(db);
  } finally {
    // Close connection
    db.close();
  }
}

main();
