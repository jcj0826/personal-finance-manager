const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'transactions.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'spend-tracker.html'));
});

app.get('/api/transactions', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) return res.json({ transactions: [], monthlyBalances: {} });
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    // backward compat: old format was a plain array
    if (Array.isArray(data)) return res.json({ transactions: data, startingBalance: 0 });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/transactions', (req, res) => {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to write data' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Spend Tracker running at:`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://<your-ip>:${PORT}  (find with: ipconfig getifaddr en0)`);
});
