const axios = require('axios');
const { getChatbotToken } = require('./zoomAuth');
const { sendChatToZoom } = require('./sendChatbotMessage'); // Only import sendChatToZoom

let conversationHistory = {};

// Function to handle communication with the Anthropc API
async function callAnthropicAPI(payload) {
  try {
    const userJid = payload.toJid;
    const history = conversationHistory[userJid] || '';
    const newUserPrompt = `\n\nHuman: ${payload.cmd}\n\nAssistant:`;
    const prompt = history + newUserPrompt;

    const requestData = {
      prompt,
      model: 'claude-v1',
      max_tokens_to_sample: 5000,
      stop_sequences: ['\n\nHuman:'],
    };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const baseURL = 'https://api.anthropic.com/v1/complete';
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    };

    const response = await axios.post(baseURL, requestData, { headers });
    const completion = response.data.completion;

    // Save conversation history
    conversationHistory[userJid] = prompt + completion;
    
    // Get Zoom chatbot token and send message to Zoom
    const chatbotToken = await getChatbotToken();
    await sendChatToZoom(chatbotToken, completion, payload);  // Call sendChatToZoom
  } catch (error) {
    console.error('Error calling Anthropc API:', error);
  }
}

module.exports = { callAnthropicAPI };
