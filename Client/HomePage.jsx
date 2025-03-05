import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import Spinner from "../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
import "./HomePage.css"; // Import CSS file
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState("");
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: "",
    type: "expense", // Ensure default type
    category: "",
    description: "",
  });

  // ✅ Fetch transactions using GET with query params instead of POST
  const getAllTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("User not found. Please log in.");
        return;
      }

      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/v1/transactions/",
        {
          params: {
            userid: user._id,
            frequency,
            selectedDate,
            type,
          },
        }
      );

      setAllTransactions(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
      alert("Couldn't fetch transactions. Please try again.");
    }
  };

  // ✅ Add or Edit Transaction
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("User not found. Please log in.");
        return;
      }

      setLoading(true);

      const transactionData = {
        ...formData,
        type: formData.type || "expense", // Ensure type is not null
        userid: user._id,
      };

      if (editable) {
        await axios.put("http://localhost:5000/api/v1/transactions/", {
          ...transactionData,
          transactionsId: editable._id, // Pass the transaction ID for editing
        });
        alert("Transaction updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/v1/transactions/",
          transactionData
        );
        alert("Transaction added successfully");
      }

      setLoading(false);
      setFormData({
        title: "",
        amount: "",
        date: "",
        type: "expense",
        category: "",
        description: "",
      });
      setEditable(null);
      setShowModal(false);
      getAllTransactions(); // Refresh transactions list
    } catch (error) {
      console.error("Error adding/editing transaction:", error);
      setLoading(false);
      alert("Failed to save transaction.");
    }
  };

  // ✅ Delete Transaction
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      // Send DELETE request with the transaction ID
      await axios.delete(`http://localhost:5000/api/v1/transactions/${id}`),
        alert("Transaction deleted successfully");
      setLoading(false);
      getAllTransactions(); // Refresh transactions list
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setLoading(false);
      alert("Failed to delete transaction.");
    }
  };

  // ✅ Function to export transactions as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Report", 14, 15);

    const tableColumn = [
      "Date",
      "Title",
      "Type",
      "Category",
      "Amount",
      "Description",
    ];
    const tableRows = [];

    allTransactions.forEach((transaction) => {
      const transactionData = [
        moment(transaction.date).format("DD-MM-YYYY"),
        transaction.title,
        transaction.type,
        transaction.category,
        transaction.amount,
        transaction.description,
      ];
      tableRows.push(transactionData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
    });

    doc.save("transactions_report.pdf");
  };

  useEffect(() => {
    getAllTransactions();
  }, [frequency, selectedDate, type]);

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="homepage-container">
        <div className="filters-container">
          <div className="filter-item">
            <label>Select Frequency:</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="7">Last one week</option>
              <option value="30">Last one Month</option>
              <option value="365">Last one Year</option>
              <option value="Custom">Custom</option>
            </select>
            {frequency === "Custom" && (
              <input
                type="date"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            )}
          </div>

          <div className="filter-item">
            <label>Select Type:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="all">All</option>
            </select>
          </div>

          <div className="view-icons">
            <button onClick={() => setViewData("table")}>Table View</button>
            <button onClick={() => setViewData("analytics")}>
              Analytics View
            </button>
            <button className="export-button" onClick={exportToPDF}>
              Export to PDF
            </button>
          </div>

          <button
            className="add-transaction-button"
            onClick={() => setShowModal(true)}
          >
            + Add Transaction
          </button>
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editable ? "Edit Transaction" : "Add Transaction"}</h2>
              <form onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <button type="submit" className="add-transaction-button">
                  Save
                </button>
              </form>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}

        <div className="transaction-table">
          {viewData === "table" ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.map((transaction, index) => (
                  <tr key={transaction._id || index}>
                    <td>{moment(transaction.date).format("DD-MM-YYYY")}</td>
                    <td>{transaction.title}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.description}</td>
                    <td>
                      <button onClick={() => handleDelete(transaction._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Analytics allTransactions={allTransactions} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
