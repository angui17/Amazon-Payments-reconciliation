const db = require('../db/client');

async function listOrders({ page = 1, perPage = 25, filters = {} } = {}) {
  const offset = (page - 1) * perPage;
  // Build a safe query using parameterization in production
  const q = `SELECT * FROM ORDERS LIMIT ${perPage} OFFSET ${offset}`;
  const rows = await db.execute(q);
  return rows;
}

module.exports = { listOrders };
