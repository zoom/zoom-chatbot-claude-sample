require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { handleZoomWebhook } = require('./src/zoomWebhookHandler');


const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('OK');
});

// Webhook endpoint for Zoom events
app.post('/anthropic', handleZoomWebhook);

app.listen(port, () => console.log(`Zoom for Team Chat listening on port ${port}!`));
