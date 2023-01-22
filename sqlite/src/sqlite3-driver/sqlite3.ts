import { Database } from "https://deno.land/x/sqlite3@0.7.2/mod.ts";

const db = new Database("test.db");

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

  const stmt = db.prepare("SELECT id, name FROM people");

  for (const row of stmt.all()) {
    console.log(`${row.id}: ${row.name}`);
  }

  // const [version] = db.prepare("select sqlite_version()").value<[string]>()!;
  // console.log(version);
} finally {
  db.close();
}
