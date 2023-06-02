# Zoom-Anthropic-Chatbot

This project is a Zoom chatbot that uses the Anthropics API to provide responses. 

## Prerequisites

Before you can use this chatbot, you'll need the following:

- Node.js (version 12 or later)
- npm (comes with Node.js)
- A Zoom account 
- An Anthropics account

## Setup

First, clone the repository:

git clone https://github.com/ojusave/Zoom-Anthropic-Chatbot.git
cd Zoom-Anthropic-Chatbot


Next, install the required Node.js packages:

npm install


## Configuration

You need to set up your environment variables. Create a `.env` file in the project root and add the following variables:

- ZOOM_CLIENT_ID=
- ZOOM_CLIENT_SECRET=
- ZOOM_BOT_JID=
- ZOOM_WEBHOOK_SECRET_TOKEN=
- ZOOM_VERIFICATION_CODE=
- ANTHROPIC_API_KEY=


To obtain these variables:

- For Zoom variables (ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_BOT_JID, ZOOM_WEBHOOK_SECRET_TOKEN, ZOOM_VERIFICATION_CODE), refer to the [Zoom App Marketplace guide on creating a Team Chat app](https://developers.zoom.us/docs/team-chat-apps/create/).

- For the ANTHROPIC_API_KEY, you can obtain it by applying for access to Claude via the Anthropics [web console](https://console.anthropic.com/docs/api). Once you have access, you can generate API keys in your Account Settings.

## Usage

On your Zoom Team Chat App's Credentials section, go to the Local Test or Submit page depending on which environment you are using (Development or Production), and click "Add". After authorizing, you will be taken to Zoom Team Chat and see a message from the Zoom-Anthropic-Chatbot:
"Greetings from Zoom-Anthropic-Chatbot Bot!"

## Running the Application

To start the application:

npm start

The application will run on `http://localhost:4000/` by default, but you can set a different port by changing the `PORT` variable in your `.env` file.

When a message is received, the chatbot will call the Anthropics API and respond with the generated text.


