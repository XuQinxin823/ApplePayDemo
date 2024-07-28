const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Serve static files from the 'frontend' directory
app.use(express.static('Frontend'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Frontend/index.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
