const ReactSSR = require('react-dom/server')
const ejs = require('ejs')
const serialize = require('serialize-javascript')
const bootstrap = require('react-async-bootstrapper')
const Helmet = require('react-helmet').default

const getStoreState = (stores) => Object.keys(stores)
  .reduce((res, storeKey) => {
    res[storeKey] = stores[storeKey].toJson()
    return res
  }, {})

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap
    const createApp = bundle.default
    const stores = createStoreMap()
    const routerContext = {}
    const app = createApp(stores, routerContext, req.url)

    bootstrap(app).then(() => {
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }
      const content = ReactSSR.renderToString(app)
      const helmet = Helmet.rewind()
      const state = getStoreState(stores)

      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
      })
      res.send(html)
      resolve()
    }).catch(reject)
  })
}
