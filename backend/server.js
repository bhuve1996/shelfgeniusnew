const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

sql.connect(dbConfig)
  .then(() => console.log("Connected to Azure SQL Database"))
  .catch((err) => console.error("Database connection failed:", err));

app.post('/api/add-item', async (req, res) => {
  const { itemName, description, quantity } = req.body;
  if (!itemName || !description || quantity == null) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  try {
    const result = await sql.query`
      INSERT INTO StoreInventory (ItemName, Description, Quantity)
      VALUES (${itemName}, ${description}, ${quantity})
    `;
    res.status(201).send({ message: 'Item added successfully', result });
  } catch (error) {
    console.error('Error inserting item:', error);
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM StoreInventory`;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
