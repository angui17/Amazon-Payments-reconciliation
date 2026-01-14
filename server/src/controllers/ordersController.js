const db = require('../db/client');

exports.list = async (req, res, next) => {
  try {
    const { page = 1, perPage = 25 } = req.query;
    // placeholder query — adapt to your HANA schema
    const offset = (page - 1) * perPage;
    const query = `SELECT * FROM ORDERS LIMIT ${perPage} OFFSET ${offset}`;
    const rows = await db.execute(query);
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}

exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await db.execute('SELECT * FROM ORDERS WHERE ID = ?', [id]);
    res.json({ data: rows[0] || null });
  } catch (err) { next(err) }
}

exports.create = async (req, res, next) => {
  try {
    // Implement create logic
    res.status(201).json({ ok: true });
  } catch (err) { next(err) }
}
