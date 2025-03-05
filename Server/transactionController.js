const db = require("../config/connectDB"); // Import MySQL connection

// ✅ Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const [transactions] = await db.query("SELECT * FROM transactions");
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addTransaction = async (req, res) => {
    try {
      // ✅ Ensure all values are extracted from req.body
      const { title, amount, category, description, type } = req.body;
  
      // ✅ Check if all required fields are present
      if (!title || !amount || !category || !type) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // ✅ Insert into MySQL database
      const [result] = await db.query(
        "INSERT INTO transactions (title, amount, category, description, type) VALUES (?, ?, ?, ?, ?)",
        [title, amount, category, description, type]
      );
  
      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
      console.error("Error adding transaction:", error);
      res.status(500).json({ error: "Failed to add transaction" });
    }
  };
  

// ✅ Delete a transaction
const deleteTransaction = async (req, res) => {
    try {
      const { id } = req.params; // Get transaction ID from URL
  
      // Check if ID exists
      if (!id) {
        return res.status(400).json({ message: "Transaction ID is required" });
      }
  
      const deletedTransaction = await Transaction.findByIdAndDelete(id);
  
      if (!deletedTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
  
      res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

// ✅ Export functions
module.exports = { getAllTransactions, addTransaction, deleteTransaction };
