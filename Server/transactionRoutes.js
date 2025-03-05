const express = require("express");
const {
  getAllTransactions,
  addTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const router = express.Router();

// ✅ Get all transactions
router.get("/", getAllTransactions);

// ✅ Add a new transaction
router.post("/", addTransaction);

// ✅ Delete a transaction
router.delete("/transactions/:id", deleteTransaction);

module.exports = router;
