const ReactSSR = require('react-dom/server')
const ejs = require('ejs')
const serialize = require('serialize-javascript')
const bootstrap = require('react-async-bootstrapper')
const Helmet = require('react-helmet').default
const SheetsRegistry = require('react-jss/lib/jss').SheetsRegistry
const createMuiTheme = require('@material-ui/core/styles').createMuiTheme
const createGenerateClassName = require('@material-ui/core/styles').createGenerateClassName
const colors = require('@material-ui/core/colors')

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
    const theme = createMuiTheme({
      palette: {
        primary: colors.blue,
        secondary: colors.pink,
      },
    })
    const sheetsRegistry = new SheetsRegistry()
    const generateClassName = createGenerateClassName()
    const routerContext = {}
    const app = createApp(stores, routerContext, sheetsRegistry, generateClassName, theme, req.url)

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
        materialCss: sheetsRegistry.toString(),
      })
      res.send(html)
      resolve()
    }).catch(reject)
  })
}
