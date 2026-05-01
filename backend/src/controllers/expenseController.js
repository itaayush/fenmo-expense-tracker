const { getDb } = require("../db/database");
const {
  createExpense: createExpenseService,
  getExpenses: getExpensesService,
} = require("../services/expenseService");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

async function createExpense(req, res) {
  try {
    const { amount, category, description, date } = req.body || {};
    const idempotencyKey = req.headers["x-idempotency-key"];

    if (amount === undefined || amount === null) {
      return res.status(400).json({ error: "Amount is required." });
    }

    if (typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be a positive integer in cents." });
    }

    if (!isNonEmptyString(category)) {
      return res.status(400).json({ error: "Category is required." });
    }

    if (!isNonEmptyString(date)) {
      return res.status(400).json({ error: "Date is required." });
    }

    const expenseDate = new Date(date);
    const now = new Date();

    if (expenseDate > now) {
      return res
        .status(400)
        .json({ error: "Expense date cannot be in the future." });
    }

    let existing = null;

    if (idempotencyKey) {
      const db = await getDb();
      existing = await db.get(
        "SELECT * FROM expenses WHERE idempotency_key = ?",
        idempotencyKey
      );
    }

    const expense = await createExpenseService(
      { amount, category, description, date },
      idempotencyKey
    );

    const status = existing ? 200 : 201;
    return res.status(status).json(expense);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
}

async function getExpenses(req, res) {
  try {
    const { category, sort } = req.query || {};
    const expenses = await getExpensesService({ category, sort });
    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = {
  createExpense,
  getExpenses,
};
