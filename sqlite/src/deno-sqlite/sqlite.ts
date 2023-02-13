/**
 * This file creates a sqlite database table, inserts data into it and queries the data
 * using the deno-sqlite library.
 */
import { DB } from "deno-sqlite";

function run(db: DB): void {
  db.execute(`
  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )
`);

  // Insert data into the table
  for (const name of ["Peter Parker", "Clark Kent", "Bruce Wayne"]) {
    db.query("INSERT INTO people (name) VALUES (?)", [name]);
  }

  // Run a query and print out the rows
  console.log("Query using DB.query()");
  const results = db.query<[number, string]>(
    "SELECT id, name FROM people",
  );

  for (const [id, name] of results) {
    console.log(`${id}: ${name}`);
  }

  // Use a prepared statement
  console.log("Query using a prepared statement");
  const query = db.prepareQuery<[number, string]>(
    "SELECT id, name FROM people",
  );

  for (const [id, name] of query.iter()) {
    console.log(`${id}: ${name}`);
  }

  query.finalize();
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
