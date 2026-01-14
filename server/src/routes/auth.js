const express = require('express');
const router = express.Router();

// placeholder auth endpoints
router.post('/login', (req, res) => {
  const { username } = req.body;
  // NOTE: Implement real auth against HANA or identity provider
  res.json({ token: 'demo-token', user: { name: username || 'demo' } });
});

router.post('/refresh', (req, res) => {
  res.json({ token: 'demo-token' });
});

module.exports = router;
