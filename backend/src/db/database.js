const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let dbPromise;

async function initDb() {
  const db = await open({
    filename: process.env.SQLITE_FILE || ":memory:",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      amount INTEGER NOT NULL,
      category TEXT,
      description TEXT,
      date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      idempotency_key TEXT UNIQUE
    );
  `);

  return db;
}

function getDb() {
  if (!dbPromise) {
    dbPromise = initDb();
  }

  return dbPromise;
}

module.exports = {
  getDb,
};
