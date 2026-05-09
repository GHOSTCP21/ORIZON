const Database = require('better-sqlite3');
const db = new Database('orizon.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    userId TEXT,
    guildId TEXT,
    balance INTEGER DEFAULT 0,
    bank INTEGER DEFAULT 0,
    dailyLastUsed TEXT,
    workLastUsed TEXT,
    warnings INTEGER DEFAULT 0,
    PRIMARY KEY (userId, guildId)
  );

  CREATE TABLE IF NOT EXISTS inventory (
    userId TEXT,
    guildId TEXT,
    itemId TEXT,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (userId, guildId, itemId)
  );

  CREATE TABLE IF NOT EXISTS guilds (
    guildId TEXT PRIMARY KEY,
    logChannel TEXT,
    suggestionChannel TEXT,
    reportChannel TEXT,
    antiSpam INTEGER DEFAULT 1,
    antiLinks INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS items (
    itemId TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    price INTEGER,
    emoji TEXT,
    roleToGive TEXT
  );
`);

module.exports = {
  getUser: async (userId, guildId) => {
    return db.prepare('SELECT * FROM users WHERE userId = ? AND guildId = ?').get(userId, guildId);
  },
  createUser: async (userId, guildId) => {
    db.prepare('INSERT OR IGNORE INTO users (userId, guildId) VALUES (?, ?)').run(userId, guildId);
  },
  updateUser: async (userId, guildId, data) => {
    const sets = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      sets.push(`${key} = ?`);
      values.push(value);
    }
    values.push(userId, guildId);
    db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE userId = ? AND guildId = ?`).run(...values);
  },
  getInventory: async (userId, guildId) => {
    return db.prepare('SELECT * FROM inventory WHERE userId = ? AND guildId = ?').all(userId, guildId);
  },
  addInventoryItem: async (userId, guildId, itemId, quantity = 1) => {
    const existing = db.prepare('SELECT * FROM inventory WHERE userId = ? AND guildId = ? AND itemId = ?').get(userId, guildId, itemId);
    if (existing) {
      db.prepare('UPDATE inventory SET quantity = quantity + ? WHERE userId = ? AND guildId = ? AND itemId = ?')
        .run(quantity, userId, guildId, itemId);
    } else {
      db.prepare('INSERT INTO inventory (userId, guildId, itemId, quantity) VALUES (?, ?, ?, ?)')
        .run(userId, guildId, itemId, quantity);
    }
  },
  getItem: async (itemId) => {
    return db.prepare('SELECT * FROM items WHERE itemId = ?').get(itemId);
  },
  getAllItems: async () => {
    return db.prepare('SELECT * FROM items').all();
  },
  getGuild: async (guildId) => {
    return db.prepare('SELECT * FROM guilds WHERE guildId = ?').get(guildId);
  },
  createGuild: async (guildId) => {
    db.prepare('INSERT OR IGNORE INTO guilds (guildId) VALUES (?)').run(guildId);
  },
  updateGuild: async (guildId, data) => {
    const sets = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      sets.push(`${key} = ?`);
      values.push(value);
    }
    values.push(guildId);
    db.prepare(`UPDATE guilds SET ${sets.join(', ')} WHERE guildId = ?`).run(...values);
  },
  getTopUsers: async (guildId, limit = 10) => {
    return db.prepare('SELECT * FROM users WHERE guildId = ? ORDER BY balance + bank DESC LIMIT ?').all(guildId, limit);
  }
};