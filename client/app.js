import React from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader' // eslint-disable-line
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { blue, pink } from '@material-ui/core/colors'
import AppStateClass from './store/app-state'
import App from './views/App'

class Main extends React.Component {
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    return <App />
  }
}

const Container = () => {
  const initialState = window.__INIT__STATE__.appState // eslint-disable-line
  const theme = createMuiTheme({
    palette: {
      primary: blue,
      secondary: pink,
    },
  })
  return (
    <Provider appState={new AppStateClass(initialState)}>
      <Router>
        <MuiThemeProvider theme={theme}>
          <Main />
        </MuiThemeProvider>
      </Router>
    </Provider>
  )
}

const AppHot = hot(module)(Container)

ReactDOM.hydrate(<AppHot />, document.getElementById('root'))
