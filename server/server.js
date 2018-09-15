const express = require('express')
const ReactSSR  = require('react-dom/server')
const fs = require('fs')
const path = require('path')

const app = express()
const isDev = process.env.NODE_ENV === 'development'

if (!isDev) {
  const serverEntry = require('../dist/server-entry').default
  const templateHtml = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8')

  app.use('/public', express.static(path.join(__dirname, '../dist')))

  app.get('*', function(req, res) {
    const appString = ReactSSR.renderToString(serverEntry)
    const resHtml = templateHtml.replace('<!-- app -->', appString)
    res.send(resHtml)
  })
} else {
  const devStatic = require('./utils/dev-static')
  devStatic(app)
}

app.listen(3333, function() {
  console.log('server is listening on 3333')
})