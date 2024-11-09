import sql from 'mssql';

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: true, // Enable encryption for Azure SQL
    trustServerCertificate: false, // Required for Azure
  },
};

let pool;

export async function getDbPool() {
  if (!pool) {
    try {
      pool = await sql.connect(dbConfig);
      console.log('Connected to Azure SQL Database');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }
  return pool;
}
