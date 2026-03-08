# Personal Finance Manager

A simple personal finance tracker for tracking income and expenses across categories.

## Setup

```bash
npm install
npm start
```

Open `http://localhost:3000` in your browser.

## Network Access

To access from other devices on your home network, find your machine's local IP:

```bash
ipconfig getifaddr en0
```

Then open `http://<your-ip>:3000` from any device on the same network.

## Importing Data

Transactions can be imported month by month from a CSV file:

1. In Google Sheets: **File → Download → Comma Separated Values (.csv)**
2. Click **Import CSV** in the app header
3. Select your file and map the columns (date, amount, description, category)
4. Click Import

The importer handles common date formats (MM/DD/YYYY, YYYY-MM-DD) and will skip duplicate rows by default.

## Data Storage

Transactions are stored in `data/transactions.json` on the machine running the server. This file is gitignored and never committed.
