import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { blue, pink } from '@material-ui/core/colors'
import { AppState, TopicStore } from '../store/store'
import App from '../views/App'

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

const appState = new AppState()
const topicStore = new TopicStore()

const Container = () => {
  // const initialState = window.__INIT__STATE__.appState // eslint-disable-line
  const theme = createMuiTheme({
    palette: {
      primary: blue,
      secondary: pink,
    },
  })
  return (
    <Provider appState={appState} topicStore={topicStore}>
      <Router>
        <MuiThemeProvider theme={theme}>
          <Main />
        </MuiThemeProvider>
      </Router>
    </Provider>
  )
}

export default Container
