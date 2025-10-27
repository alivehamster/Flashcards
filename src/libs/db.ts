import mysql from "mysql2/promise";

const dbName = process.env.DB_NAME || "flashcards";

const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "example",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool;

async function initializeDatabase() {
  try {

    const connection = await mysql.createConnection(poolConfig);

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await connection.execute(`USE ${dbName}`);

    // Create Accounts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Accounts (
        UserId INT AUTO_INCREMENT PRIMARY KEY,
        Email VARCHAR(255) UNIQUE NOT NULL,
        Username VARCHAR(100) UNIQUE NOT NULL,
        PasswordHash VARCHAR(255) NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Decks table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Decks (
        DeckId INT AUTO_INCREMENT PRIMARY KEY,
        UserId INT NOT NULL,
        Title VARCHAR(255) NOT NULL,
        Length INT DEFAULT 0,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserId) REFERENCES Accounts(UserId) ON DELETE CASCADE
      )
    `);

    // Create Cards table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Cards (
        CardId INT AUTO_INCREMENT PRIMARY KEY,
        DeckId INT NOT NULL,
        Position INT NOT NULL,
        Front TEXT NOT NULL,
        Back TEXT NOT NULL,
        FOREIGN KEY (DeckId) REFERENCES Decks(DeckId) ON DELETE CASCADE
      )
    `);

    await connection.end();
    console.log("Database and tables initialized successfully");

    pool = mysql.createPool({
      ...poolConfig,
      database: dbName,
    });
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

export async function getPool(): Promise<mysql.Pool> {
  if (!pool) {
    await initializeDatabase();
  }
  return pool;
}