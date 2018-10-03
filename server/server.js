const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'stream forum',
}))
app.use(favicon(path.join(__dirname, '../favicon.ico')))
app.use('/api/user', require('./utils/handle-login'))
app.use('/api', require('./utils/proxy'))

const isDev = process.env.NODE_ENV === 'development'
if (!isDev) {
  const serverEntry = require('../dist/server-entry').default
  const templateHtml = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8')

  app.use('/public', express.static(path.join(__dirname, '../dist')))

  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(serverEntry)
    const resHtml = templateHtml.replace('<!-- app -->', appString)
    res.send(resHtml)
  })
} else {
  const devStatic = require('./utils/dev-static')
  devStatic(app)
}

app.listen(3333, function () {
  console.log('server is listening on 3333')
})
