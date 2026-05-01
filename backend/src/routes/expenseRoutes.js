const express = require("express");
const {
  createExpense,
  getExpenses,
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/expenses", createExpense);
router.get("/expenses", getExpenses);

module.exports = router;
