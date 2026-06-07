const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const Transaction = require("./models/Transaction");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// Test route
app.get("/", (req, res) => {
  res.send("Khata Book API is running");
});

// Add new transaction
app.post("/transactions", async (req, res) => {
  try {
    const { title, amount, type } = req.body;

    const newTransaction = new Transaction({
      title,
      amount,
      type
    });

    await newTransaction.save();

    res.json({
      message: "Transaction added successfully",
      transaction: newTransaction
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding transaction",
      error: error.message
    });
  }
});

// Get all transactions
app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transactions",
      error: error.message
    });
  }
});

// Delete transaction
app.delete("/transactions/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);

    res.json({
      message: "Transaction deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting transaction",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.put("/transactions/:id", async (req, res) => {
  try {
    const { title, amount, type } = req.body;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        title,
        amount,
        type
      },
      {
        new: true
      }
    );

    res.json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating transaction",
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});