const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const httpProxy = require('http-proxy-middleware')
const serverConfig = require('../../build/webpack.config.server')
const serverRender = require('./server-render')

let serverEntry

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const NativeModule = require('module')
const vm = require('vm')

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true,
  })
  const result = script.runInThisContext()
  result(m.exports, require, m)
  return m
}

const mfs = new MemoryFs()
serverConfig.mode = 'development'
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warning => console.warn(warning))

  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename)
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = getModuleFromString(bundle, 'serverEntry.js')
  serverEntry = m.exports
})

module.exports = app => {
  app.use('/public', httpProxy({ target: 'http://localhost:8888' }))
  app.get('*', (req, res, next) => {
    if (!serverEntry) {
      return res.send('waiting for compile, refresh after a few seconds')
    }
    getTemplate().then(template => {
      return serverRender(serverEntry, template, req, res)
    }).catch(next)
  })
}
