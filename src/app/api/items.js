import { getDbPool } from '../lib/db';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight response for CORS
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pool = await getDbPool();
    const result = await pool.request().query(`
      SELECT TOP (1000) [ItemID], [ItemName], [Description], [Quantity]
      FROM [dbo].[StoreInventory]
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: error.message });
  }
}
