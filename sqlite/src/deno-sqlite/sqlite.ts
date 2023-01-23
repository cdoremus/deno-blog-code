import { DB } from "https://deno.land/x/sqlite/mod.ts";

function run(db: DB): void {
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
  const query = db.prepareQuery<[number, string]>(
    "SELECT id, name FROM people",
  );

  for (const [id, name] of query.iter()) {
    console.log(`${id}: ${name}`);
  }

  query.finalize();

  // for (const [id, name] of db.query("SELECT id, name FROM people")) {
  //   console.log(`${id}: ${name}`);
  // }
}

function main() {
  // Open a database
  const db: DB = new DB("test.db");
  try {
    run(db);
  } finally {
    // Close connection
    db.close();
  }
}

main();
