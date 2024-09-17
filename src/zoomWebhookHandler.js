const { callAnthropicAPI } = require('./anthropic');

async function handleZoomWebhook(req, res) {
  try {
    if (req.body.event === 'bot_notification') {
      console.log('Zoom Team Chat App message received.');
      await callAnthropicAPI(req.body.payload);
    } else if (req.body.event === 'bot_installed') {
      console.log('Zoom for Team Chat installed.');
    } else if (req.body.event === 'app_deauthorized') {
      console.log('Zoom for Team Chat uninstalled.');
    } else if (req.body.event === 'endpoint.url_validation') {
      res.status(200).json({
        message: {
          plainToken: req.body.payload.plainToken,
        },
      });
    } else {
      console.log('Unsupported Zoom webhook event type:', req.body.event);
    }

    res.status(200).send('Event processed.');
  } catch (error) {
    console.error('Error handling Zoom webhook event:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { handleZoomWebhook };
