import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'
import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from '@material-ui/core/styles'
import App from './views/App'
import { createStoreMap } from './store/store'

useStaticRendering(true)
export default
(stores, routerContext, sheetsRegistry, sheetsManager, generateClassName, theme, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
          <App />
        </MuiThemeProvider>
      </JssProvider>
    </StaticRouter>
  </Provider>
)

export { createStoreMap }
