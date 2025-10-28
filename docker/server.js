const express = require('express');
const path = require('path');
const app = express();
const port = 8080;
const packageJson = require('./package.json');

// API endpoint to get app version
app.get('/api/version', (req, res) => {
  res.json({ version: packageJson.version });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for the root path to ensure index.html is loaded
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
