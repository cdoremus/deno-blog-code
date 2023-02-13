/**
 * This file creates a sqlite database table, inserts data into it and queries the data
 * using the sqlite3 library.
 */
import { Database } from "sqlite3";

// const db = new Database("test.db");
const db = new Database(":memory:");

try {
  db.exec(
    `
  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )
`,
  );

  for (const name of ["Peter Parker", "Clark Kent", "Bruce Wayne"]) {
    db.exec("INSERT INTO people (name) VALUES (?)", [name]);
  }

  let stmt = db.prepare("SELECT id, name FROM people");

  for (const row of stmt.all()) {
    console.log(`${row.id}: ${row.name}`);
  }
  stmt.finalize();

  // Parameterized statement
  stmt = db.prepare("SELECT id, name FROM people where id=:id");
  // const row = stmt.bind({ id: 1 });
  stmt.run({ id: 1 });
  console.log(`Row for id 1: `, stmt.get(1));

  // console.log(`Row for id 1: `, row.get(1));
  stmt.finalize();

  // const [version] = db.prepare("select sqlite_version()").value<[string]>()!;
  // console.log(version);
} finally {
  db.close();
}
