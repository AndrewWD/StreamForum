import React, { Component } from 'react'
import { hot } from 'react-hot-loader' // eslint-disable-line
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { Provider } from 'mobx-react'
import Routes from '../config/router'
import appState from '../store/app-state'

class App extends Component {
  componentDidMount() {

  }

  render() {
    return [
      <ul>
        <li><Link to="/">首页</Link></li>
        <li><Link to="/detail">详情页</Link></li>
      </ul>,
      <Routes />,
    ]
  }
}

const Container = () => (
  <Provider appState={appState}>
    <Router>
      <App />
    </Router>
  </Provider>
)

export default hot(module)(Container)
