require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('OK');
});

app.get('/authorize', (req, res) => {
  res.redirect('https://zoom.us/launch/chat?jid=robot_' + process.env.ZOOM_BOT_JID);
});

app.post('/anthropic', async (req, res) => {
    const message = `v0:${req.headers['x-zm-request-timestamp']}:${JSON.stringify(req.body)}`;
    const hashForVerify = crypto.createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN).update(message).digest('hex');
    const signature = `v0=${hashForVerify}`;
  
    if (req.headers['x-zm-signature'] === signature) {
      if (req.body.event === 'endpoint.url_validation') {
        const hashForValidate = crypto.createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN).update(req.body.payload.plainToken).digest('hex');
        const response = {
          message: {
            plainToken: req.body.payload.plainToken,
            encryptedToken: hashForValidate
          },
          status: 200
        };
  
        console.log(response.message);
  
        res.status(response.status);
        res.json(response.message);
      } else {
        const response = { message: 'Authorized request to get Zoom meeting recordings.', status: 200 };
  
        console.log(response.message);
  
        res.status(response.status);
        res.json(response);
  
        if (req.body.event === 'bot_notification') {
          console.log('Zoom Team Chat App message received.');
          await callAnthropicAPI(req.body.payload); // Await the callAnthropicAPI function
        } else if (req.body.event === 'bot_installed') {
          console.log('Zoom for Team Chat installed.');
        } else if (req.body.event === 'app_deauthorized') {
          console.log('Zoom for Team Chat uninstalled.');
        } else {
          console.log('Unsupported Zoom webhook event type: ', req.body.event);
          console.log(req.body);
        }
      }
    } else {
      const response = { message: 'Unauthorized request to get Zoom meeting recordings.', status: 401 };
  
      console.log(response.message);
  
      res.status(response.status);
      res.json(response);
    }
  });
  
  async function callAnthropicAPI(payload) {
    try {
      const prompt = `\n\nHuman: ${payload.cmd}\n\nAssistant:`;
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

      // Print the complete response from the Anthropic API
      console.log('Anthropic API response:', response.data);

      const completion = response.data.completion;
  
      await getChatbotToken(completion, payload); // Await the getChatbotToken function
    } catch (error) {
      console.log('Error calling Anthropc API:', error);
    }
  }

  
  async function getChatbotToken(message, payload) {
    try {
      const response = await axios.post('https://zoom.us/oauth/token?grant_type=client_credentials', {}, {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(process.env.ZOOM_CLIENT_ID + ':' + process.env.ZOOM_CLIENT_SECRET).toString('base64')
        }
      });
  
      console.log('Successfully received chatbot_token from Zoom.');
      const chatbotToken = response.data.access_token;
      await sendChat(chatbotToken, message, payload); // Await the sendChat function
    } catch (error) {
      console.log('Error getting chatbot_token from Zoom.', error);
    }
  }
  
  function sendChat(chatbotToken, message, payload) {
    axios.post('https://api.zoom.us/v2/im/chat/messages', {
      'robot_jid': process.env.ZOOM_BOT_JID,
      'to_jid': payload.toJid,
      'account_id': payload.accountId,
      'content': {
        'head': {
          'text': 'Anthropic AI'
        },
        'body': [{
          'type': 'message',
          'text': 'Claude: ' + message
        }]
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + chatbotToken
      }
    }).then((response) => {
      console.log('Successfully sent chat.', response.data);
    }).catch((error) => {
      console.log('Error sending chat.', error);
    });
  }
  

app.listen(port, () => console.log(`Zoom for Team Chat listening on port ${port}!`));
