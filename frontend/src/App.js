import { useState, useEffect } from "react";

function App() {
  const [page, setPage] = useState("register");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [item, setItem] = useState({
    itemName: "",
    description: "",
    type: "",
    location: "",
    date: "",
    contactInfo: ""
  });

  const [items, setItems] = useState([]);

  const BASE_URL = "https://expense-backend-isnc.onrender.com";

  // FORM CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  // REGISTER
  const register = async (e) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/api/register`, {
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

    const res = await fetch(`${BASE_URL}/api/login`, {
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

  // ADD ITEM
  const addItem = async () => {
    await fetch(`${BASE_URL}/api/item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(item)
    });

    getItems();
  };

  // GET ITEMS
  const getItems = async () => {
    const res = await fetch(`${BASE_URL}/api/items`, {
      headers: { Authorization: token }
    });

    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    if (token) getItems();
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
      <h2>Lost & Found Dashboard</h2>

      <button onClick={() => {
        localStorage.removeItem("token");
        setToken(null);
        setPage("login");
      }}>
        Logout
      </button>

      <br /><br />

      <input name="itemName" placeholder="Item Name" onChange={handleItemChange} /><br /><br />
      <input name="description" placeholder="Description" onChange={handleItemChange} /><br /><br />
      <input name="type" placeholder="Type (Lost/Found)" onChange={handleItemChange} /><br /><br />
      <input name="location" placeholder="Location" onChange={handleItemChange} /><br /><br />
      <input name="date" placeholder="Date" onChange={handleItemChange} /><br /><br />
      <input name="contactInfo" placeholder="Contact Info" onChange={handleItemChange} /><br /><br />

      <button onClick={addItem}>Add Item</button>

      <h3>Items:</h3>
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            {it.itemName} - {it.type} ({it.location})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;