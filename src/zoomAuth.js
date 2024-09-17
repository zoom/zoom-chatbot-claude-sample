const axios = require('axios');

// Function to get the chatbot token from Zoom
async function getChatbotToken() {
  try {
    const response = await axios.post(
      'https://zoom.us/oauth/token?grant_type=client_credentials',
      {},
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(process.env.ZOOM_CLIENT_ID + ':' + process.env.ZOOM_CLIENT_SECRET).toString('base64'),
        },
      }
    );
    console.log('Successfully received chatbot_token from Zoom.');
    return response.data.access_token;
  } catch (error) {
    console.log('Error getting chatbot_token from Zoom.', error);
    throw error;
  }
}

module.exports = { getChatbotToken };
