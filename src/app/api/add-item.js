import { getDbPool } from '../../lib/db';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight response for CORS
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { itemName, description, quantity } = req.body;

  if (!itemName || !description || quantity == null) {
    return res.status(400).json({ error: 'All fields (itemName, description, quantity) are required' });
  }

  try {
    const pool = await getDbPool();
    const result = await pool.request().query(`
      INSERT INTO StoreInventory (ItemName, Description, Quantity)
      VALUES ('${itemName}', '${description}', ${quantity})
    `);

    res.status(201).json({ message: 'Item added successfully', result });
  } catch (error) {
    console.error('Error inserting item:', error);
    res.status(500).json({ error: error.message });
  }
}
