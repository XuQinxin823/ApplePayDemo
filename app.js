const express = require('express');
const path = require('path');
const api = require('./Server/API');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'Client' and 'Server' directories
app.use(express.static(path.join(__dirname, 'Client')));
app.use(express.static(path.join(__dirname, 'Server')));

// Routes
app.use('/', api);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});