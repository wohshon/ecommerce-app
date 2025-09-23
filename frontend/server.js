const express = require('express');
const path = require('path');
const app = express();

// Serve the React build folder
app.use(express.static(path.join(__dirname, 'build')));

// Always return index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Frontend running on port ${PORT}`));
