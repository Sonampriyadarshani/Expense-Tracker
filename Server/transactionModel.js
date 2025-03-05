const db = require('../config/connectDB.js'); // Import MySQL connection
const moment = require('moment');

// ✅ Get All Transactions
const getAllTransactions = async (req, res) => {
    try {
        const { frequency, selectedDate, type, userid } = req.query;  // Use req.query for GET request parameters
        let query = `SELECT * FROM transactions WHERE userid = ?`;
        const params = [userid];

        // Date Filter
        if (frequency !== 'Custom') {
            const startDate = moment().subtract(Number(frequency), 'days').format('YYYY-MM-DD');
            query += ` AND date >= ?`;
            params.push(startDate);
        } else if (selectedDate && selectedDate.length === 2) {  // Ensure selectedDate is an array with 2 elements
            query += ` AND date BETWEEN ? AND ?`;
            params.push(selectedDate[0], selectedDate[1]);
        }

        // Type Filter
        if (type !== 'all') {
            query += ` AND type = ?`;
            params.push(type);
        }

        db.query(query, params, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(results);
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




// ✅ Add Transaction
const addTransaction = async (req, res) => {
    try {
      const { amount, type, category, date, title, description } = req.body;
  
      if (!title || !type) {
        return res.status(400).json({ error: "'title' and 'type' fields are required and cannot be null" });
      }
  
      const [result] = await pool.query(
        "INSERT INTO transactions (amount, type, category, date, title, description) VALUES (?, ?, ?, ?, ?, ?)",
        [amount, type, category, date, title, description]
      );
  
      res.status(201).json({ message: "Transaction added successfully", transactionId: result.insertId });
    } catch (error) {
      console.error("Error adding transaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  



// ✅ Edit Transaction
const editTransaction = async (req, res) => {
    try {
        const { transactionId, amount, type, category, date, description } = req.body;
        const sql = `UPDATE transactions SET amount=?, type=?, category=?, date=?, description=? WHERE id=?`;

        db.query(sql, [amount, type, category, date, description, transactionId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: "Transaction edited successfully" });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// ✅ Delete Transaction
const deleteTransaction = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const sql = `DELETE FROM transactions WHERE id=?`;

        db.query(sql, [transactionId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: "Transaction deleted successfully" });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// Export Functions
module.exports = { getAllTransactions, addTransaction, editTransaction, deleteTransaction };
