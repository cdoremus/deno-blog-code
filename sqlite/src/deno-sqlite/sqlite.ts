import { DB } from "https://deno.land/x/sqlite/mod.ts";

// Open a database
const db = new DB("test.db");
try {
  db.execute(`
  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )
`);

  // Run a simple query
  for (const name of ["Peter Parker", "Clark Kent", "Bruce Wayne"]) {
    db.query("INSERT INTO people (name) VALUES (?)", [name]);
  }

  // Print out data in table
  // Use a prepared statement
  // const query = db.prepareQuery<[number, string]>(
  //   "SELECT id, name FROM people",
  // );

  // for (const [id, name] of query.iter()) {
  //   console.log(`${id}: ${name}`);
  // }

  for (const [id, name] of db.query("SELECT id, name FROM people")) {
    console.log(`${id}: ${name}`);
  }

  // Close connection
} finally {
  db.transaction;
  db.close();
}
