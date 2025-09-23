#!/usr/bin/env node

/**
 * Heroku Postdeploy Script for Chat Widget Template
 *
 * This script runs after successful Heroku deployment to notify
 * the Stratis AI platform about the deployment status.
 */

const https = require('https');
const { URL } = require('url');

async function notifyDeploymentSuccess() {
  const callbackUrl = process.env.STRATISAI_DEPLOYMENT_CALLBACK_URL;
  const orgId = process.env.STRATISAI_ORG_ID;
  const chatClientId = process.env.STRATISAI_CHAT_CLIENT_ID;
  const appName = process.env.HEROKU_APP_NAME;

  if (!callbackUrl || !orgId || !chatClientId) {
    console.log('Missing required environment variables:');
    console.log('STRATISAI_DEPLOYMENT_CALLBACK_URL:', !!callbackUrl);
    console.log('STRATISAI_ORG_ID:', !!orgId);
    console.log('STRATISAI_CHAT_CLIENT_ID:', !!chatClientId);
    process.exit(1);
  }

  // Construct the deployed URL
  const deployedUrl = appName
    ? `https://${appName}.herokuapp.com`
    : process.env.HEROKU_APP_URL || 'https://unknown.herokuapp.com';

  const callbackData = {
    chat_client_id: chatClientId,
    app_name: appName || 'unknown',
    deployed_url: deployedUrl,
    deployment_status: 'deployed'
  };

  console.log('Notifying Stratis AI platform of successful deployment...');
  console.log('Callback URL:', callbackUrl);
  console.log('Deployed URL:', deployedUrl);
  console.log('Chat Client ID:', chatClientId);

  try {
    const response = await makeHttpRequest(callbackUrl, callbackData);
    console.log('✅ Successfully notified Stratis AI platform');
    console.log('Response status:', response.statusCode);
  } catch (error) {
    console.error('❌ Failed to notify Stratis AI platform:', error.message);
    // Don't fail the deployment if callback fails
    console.log('Continuing despite callback failure...');
  }
}

function makeHttpRequest(url, data) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const postData = JSON.stringify(data);

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Heroku-ChatWidget-Deploy/1.0'
      },
      timeout: 30000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            statusCode: res.statusCode,
            body: body
          });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Run the script
if (require.main === module) {
  notifyDeploymentSuccess()
    .then(() => {
      console.log('Postdeploy script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Postdeploy script failed:', error);
      process.exit(0); // Don't fail deployment on callback errors
    });
}

module.exports = { notifyDeploymentSuccess };