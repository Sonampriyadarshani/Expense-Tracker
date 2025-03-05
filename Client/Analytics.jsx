import React from "react";
import "./Analytics.css"; // Importing the CSS file

const Analytics = ({ allTransactions }) => {
  const totalTransactions = allTransactions.length;

  const { totalIncome, totalExpenses, incomeCount, expenseCount } =
    allTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.totalIncome += transaction.amount;
          acc.incomeCount += 1;
        } else if (transaction.type === "expense") {
          acc.totalExpenses += transaction.amount;
          acc.expenseCount += 1;
        }
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0, incomeCount: 0, expenseCount: 0 }
    );

  const totalIncomePercent = totalTransactions
    ? (incomeCount / totalTransactions) * 100
    : 0;
  const totalExpensePercent = totalTransactions
    ? (expenseCount / totalTransactions) * 100
    : 0;

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">Analytics</h2>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Transactions</h3>
          <p>{totalTransactions}</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "100%" }}></div>
          </div>
        </div>
        <div className="analytics-card">
          <h3>Total Income Transactions</h3>
          <p>
            {incomeCount} (₹{totalIncome})
          </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${totalIncomePercent}%` }}
            ></div>
          </div>
        </div>
        <div className="analytics-card">
          <h3>Total Expense Transactions</h3>
          <p>
            {expenseCount} (₹{totalExpenses})
          </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${totalExpensePercent}%`, background: "red" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
