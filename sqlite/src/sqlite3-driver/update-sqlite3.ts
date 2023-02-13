/**
 * This file creates a sqlite database table, inserts data
 * into it and updates a record
 * using the sqlite3 library.
 */
import { Database } from "sqlite3";

function insert(db: Database) {
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

  // const [version] = db.prepare("select sqlite_version()").value<[string]>()!;
  // console.log(version);
}

function queryAll(db: Database) {
  const stmt = db.prepare("SELECT id, name FROM people");

  for (const row of stmt.all()) {
    console.log(`${row.id}: ${row.name}`);
  }
  stmt.finalize();
}

function queryById(db: Database, id: number) {
  // Parameterized statement
  const stmt = db.prepare("SELECT id, name FROM people where id=?");
  const row = stmt.get(id);
  console.log(`Row for id ${id}: `, row);
  stmt.finalize();
}

function update(db: Database, newName: string, id: number) {
  // const stmt = db.prepare(`UPDATE people set name='${newName}' where id=?`);
  const stmt = db.prepare(`UPDATE people set name=? where id=?`);
  stmt.run(newName, id);
  console.log(
    `Updated record for id ${id} with new name '${newName}'`,
  );
  stmt.finalize();
}

function main() {
  const db = new Database(":memory:");
  const id = 1;
  try {
    insert(db);
    queryAll(db);
    queryById(db, id);
    update(db, "Wade Winston Wilson", id);
    queryById(db, id);
  } finally {
    db.close();
  }
}

main();
