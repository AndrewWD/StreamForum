import React, { Component } from 'react'
import { hot } from 'react-hot-loader' // eslint-disable-line
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { Provider } from 'mobx-react'
import Routes from '../config/router'
import AppStateClass from '../store/app-state'

export class App extends Component {
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

const Container = () => {
  const initialState = window.__INIT__STATE__.appState // eslint-disable-line
  return (
    <Provider appState={new AppStateClass(initialState)}>
      <Router>
        <App />
      </Router>
    </Provider>
  )
}

export default hot(module)(Container)
