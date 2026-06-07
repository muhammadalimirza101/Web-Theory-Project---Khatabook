const API_URL = "http://localhost:5001/transactions";

let editingId = null;

async function getTransactions() {
  const response = await fetch(API_URL);
  const transactions = await response.json();

  showTransactions(transactions);
  calculateSummary(transactions);
}

async function addTransaction() {
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  if (title === "" || amount === "") {
    alert("Please fill all fields");
    return;
  }

  const transaction = {
    title: title,
    amount: Number(amount),
    type: type
  };

  try {
  let response;

  if (editingId === null) {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(transaction)
    });
  } else {
    response = await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(transaction)
    });
  }

  const data = await response.json();

    console.log("Saved data:", data);

    if (!response.ok) {
      alert("Error: " + data.message);
      return;
    }

    document.getElementById("title").value = "";
document.getElementById("amount").value = "";
document.getElementById("type").value = "income";

editingId = null;
document.querySelector("button").innerText = "Add Record";

getTransactions();

  } catch (error) {
    console.log("Frontend error:", error);
    alert("Cannot connect to backend. Make sure backend server is running.");
  }
}

function showTransactions(transactions) {
  const transactionList = document.getElementById("transactionList");

  transactionList.innerHTML = "";

  transactions.forEach(function(transaction) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${transaction.title}</td>
      <td>${transaction.amount}</td>
      <td class="${transaction.type}">${transaction.type}</td>
      <td>
        <button class="edit-btn" onclick="editTransaction('${transaction._id}', '${transaction.title}', ${transaction.amount}, '${transaction.type}')">
          Edit
        </button>
        <button class="delete-btn" onclick="deleteTransaction('${transaction._id}')">
          Delete
        </button>
      </td>
    `;

    transactionList.appendChild(row);
  });
}

function calculateSummary(transactions) {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(function(transaction) {
    if (transaction.type === "income") {
      totalIncome = totalIncome + transaction.amount;
    } else {
      totalExpense = totalExpense + transaction.amount;
    }
  });

  const balance = totalIncome - totalExpense;

  document.getElementById("totalIncome").innerText = totalIncome;
  document.getElementById("totalExpense").innerText = totalExpense;
  document.getElementById("balance").innerText = balance;
}

async function deleteTransaction(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  getTransactions();
}

getTransactions();

function editTransaction(id, title, amount, type) {
  document.getElementById("title").value = title;
  document.getElementById("amount").value = amount;
  document.getElementById("type").value = type;

  editingId = id;

  document.querySelector("button").innerText = "Update Record";
}