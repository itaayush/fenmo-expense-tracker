const { randomUUID } = require("crypto");
const { getDb } = require("../db/database");

async function createExpense(expenseData, idempotencyKey) {
  const db = await getDb();

  if (idempotencyKey) {
    const existing = await db.get(
      "SELECT * FROM expenses WHERE idempotency_key = ?",
      idempotencyKey
    );

    if (existing) {
      return existing;
    }
  }

  const expense = {
    id: randomUUID(),
    amount: expenseData.amount,
    category: expenseData.category || null,
    description: expenseData.description || null,
    date: expenseData.date || null,
    idempotency_key: idempotencyKey || null,
  };

  await db.run(
    `
      INSERT INTO expenses (
        id,
        amount,
        category,
        description,
        date,
        idempotency_key
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    expense.id,
    expense.amount,
    expense.category,
    expense.description,
    expense.date,
    expense.idempotency_key
  );

  return expense;
}

async function getExpenses(filters = {}) {
  const db = await getDb();

  const whereClauses = [];
  const params = [];

  if (filters.category) {
    whereClauses.push("category = ?");
    params.push(filters.category);
  }

  const whereSql = whereClauses.length
    ? `WHERE ${whereClauses.join(" AND ")}`
    : "";

  const orderSql = filters.sort === "date_desc" ? "ORDER BY date DESC" : "";

  return db.all(
    `
      SELECT *
      FROM expenses
      ${whereSql}
      ${orderSql}
    `,
    params
  );
}

module.exports = {
  createExpense,
  getExpenses,
};
