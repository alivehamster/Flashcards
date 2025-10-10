import mysql from 'mysql2/promise';

// Create connection pool
export const pool = mysql.createPool({
  host: import.meta.env.DB_HOST || 'localhost',
  user: import.meta.env.DB_USER || 'root',
  password: import.meta.env.DB_PASSWORD || '',
  database: import.meta.env.DB_NAME || 'flashcards',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  try {
    // Create Accounts table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS Accounts (
        UserId INT AUTO_INCREMENT PRIMARY KEY,
        Email VARCHAR(255) UNIQUE NOT NULL,
        Username VARCHAR(100) UNIQUE NOT NULL,
        PasswordHash VARCHAR(255) NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Decks table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS Decks (
        DeckId INT AUTO_INCREMENT PRIMARY KEY,
        UserId INT NOT NULL,
        Title VARCHAR(255) NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserId) REFERENCES Accounts(UserId) ON DELETE CASCADE
      )
    `);

    // Create Cards table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS Cards (
        CardId INT AUTO_INCREMENT PRIMARY KEY,
        DeckId INT NOT NULL,
        Position INT NOT NULL,
        Front TEXT NOT NULL,
        Back TEXT NOT NULL,
        FOREIGN KEY (DeckId) REFERENCES Decks(DeckId) ON DELETE CASCADE
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

initializeDatabase()
  