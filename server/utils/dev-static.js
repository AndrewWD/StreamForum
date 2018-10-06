const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const httpProxy = require('http-proxy-middleware')
const ReactSSR = require('react-dom/server')
const serverConfig = require('../../build/webpack.config.server')
const bootstrap = require('react-async-bootstrapper')
const ejs = require('ejs')
const serialize = require('serialize-javascript')

let serverEntry, createStoreMap

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
  serverEntry = m.exports.default
  createStoreMap = m.exports.createStoreMap
})

const getStoreState = (stores) => Object.keys(stores)
  .reduce((res, storeKey) => {
    res[storeKey] = stores[storeKey].toJson()
    return res
  }, {})

module.exports = app => {
  app.use('/public', httpProxy({ target: 'http://localhost:8888' }))
  app.get('*', (req, res) => {
    getTemplate().then(template => {
      const stores = createStoreMap()
      const routerContext = {}
      const app = serverEntry(stores, routerContext, req.url)

      bootstrap(app).then(() => {
        if (routerContext.url) {
          res.status(302).setHeader('Location', routerContext.url)
          res.end()
          return
        }
        const content = ReactSSR.renderToString(app)
        const state = getStoreState(stores)

        const html = ejs.render(template, {
          appString: content,
          initialState: serialize(state),
        })

        res.send(html)
      })
    })
  })
}
