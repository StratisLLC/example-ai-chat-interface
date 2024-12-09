# Stratis AI Agent Chat

A sample Node.js application using Express and EJS that integrates the Stratis AI Agent Chat interface, deployed on Heroku.

## Features

- **Stratis AI Agent Chat**: Embeds a chat interface for interacting with Stratis AI agents.
- **Express.js**: Backend server handling routes and rendering views.
- **EJS Templating**: Dynamic rendering of HTML pages.
- **Heroku Deployment**: Easily deploy and manage your application on Heroku.

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [Heroku CLI](https://cli.heroku.com/) installed for deploying to Heroku.
- Stratis AI account with necessary credentials.

## Installation

1. **Provision the add-on:**

   ```sh
   heroku addons:create stratisai -a HEROKU_APP_NAME
   ```

2. **Complete the add-on setup wizard:**

   ```sh
   heroku addons:open stratisai -a HEROKU_APP_NAME

   # step through the setup wizard to create your first agent and chat interface!
   ```

3. **Deploy your custom version of this application:**

After creating your chat interface in the Stratis AI setup wizard, simply click the "Deploy to Heroku" button.
This button will deploy a version of this application that already has the chat interface embedded into the HTML.

## License

This project is licensed under the MIT License.

## Helpful Links

- [Stratis AI Admin Site](https://admin.atlis.ai)
- [Stratis AI Addon Page](https://elements.heroku.com/addons/stratisai)
- [Stratis AI Addon Docs](https://devcenter.heroku.com/articles/stratisai)
- [Heroku Dev Center](https://devcenter.heroku.com/)
