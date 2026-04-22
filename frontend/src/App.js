import { useState, useEffect } from "react";

function App() {
  const [page, setPage] = useState("register");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: ""
  });

  const [expenses, setExpenses] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleExpenseChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  // REGISTER
  const register = async (e) => {
    e.preventDefault();

    const res = await fetch("https://expense-backend-isnc.onrender.com/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.msg);
    setPage("login");
  };

  // LOGIN
  const login = async (e) => {
    e.preventDefault();

    const res = await fetch("https://expense-backend-isnc.onrender.com/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);
    setToken(data.token);
    setPage("dashboard");
  };

  // ADD EXPENSE
  const addExpense = async () => {
    await fetch("https://expense-backend-isnc.onrender.com/api/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(expense)
    });

    getExpenses();
  };

  // GET EXPENSES (FIXED)
  const getExpenses = async () => {
    const res = await fetch("https://expense-backend-isnc.onrender.com/api/expenses", {
      headers: { Authorization: token }
    });

    const data = await res.json();
    console.log("API response:", data);

    // FIX: ensure array
    setExpenses(Array.isArray(data) ? data : data.expenses || []);
  };

  useEffect(() => {
    if (token) getExpenses();
  }, [token]);

  // REGISTER PAGE
  if (page === "register") {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Register</h2>

        <form onSubmit={register}>
          <input name="name" placeholder="Name" onChange={handleChange} /><br /><br />
          <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
          <input name="password" placeholder="Password" onChange={handleChange} /><br /><br />

          <button type="submit">Register</button>
        </form>

        <br />
        <button onClick={() => setPage("login")}>Go to Login</button>
      </div>
    );
  }

  // LOGIN PAGE
  if (page === "login") {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Login</h2>

        <form onSubmit={login}>
          <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
          <input name="password" placeholder="Password" onChange={handleChange} /><br /><br />

          <button type="submit">Login</button>
        </form>

        <br />
        <button onClick={() => setPage("register")}>Go to Register</button>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <button onClick={() => {
        localStorage.removeItem("token");
        setToken(null);
        setPage("login");
      }}>
        Logout
      </button>

      <br /><br />

      <input name="title" placeholder="Title" onChange={handleExpenseChange} /><br /><br />
      <input name="amount" placeholder="Amount" onChange={handleExpenseChange} /><br /><br />
      <input name="category" placeholder="Category" onChange={handleExpenseChange} /><br /><br />

      <button onClick={addExpense}>Add Expense</button>

      <h3>Your Expenses:</h3>
      <ul>
        {Array.isArray(expenses) && expenses.map((exp, i) => (
          <li key={i}>
            {exp.title} - ₹{exp.amount} ({exp.category})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;