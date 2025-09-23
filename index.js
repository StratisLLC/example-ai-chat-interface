const express = require('express')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const port = process.env.PORT || 5006

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  if (!process.env.STRATISAI_CHAT_BUBBLE_CONFIG_BASE64) {
    res.status(400).send('STRATISAI_CHAT_BUBBLE_CONFIG_BASE64 is not set')
    return
  }

  res.render('pages/index', {
    SCRIPT_STRATISAI_CHAT_BUBBLE_CONFIG: Buffer.from(process.env.STRATISAI_CHAT_BUBBLE_CONFIG_BASE64, 'base64').toString(),
    STRATISAI_CHAT_CLIENT_ID: process.env.STRATISAI_CHAT_CLIENT_ID,
    STRATISAI_ORG_ID: process.env.STRATISAI_ORG_ID,
    STRATISAI_DEPLOYMENT_CALLBACK_URL: process.env.STRATISAI_DEPLOYMENT_CALLBACK_URL,
  })
})

const server = app.listen(port, () => {
  console.log(`Listening on ${port}`)
})

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: gracefully shutting down')
  if (server) {
    server.close(() => {
      console.log('HTTP server closed')
    })
  }
})
