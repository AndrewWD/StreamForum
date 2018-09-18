import React, { Component } from 'react'
import { hot } from 'react-hot-loader' // eslint-disable-line
import { BrowserRouter as Router, Link } from 'react-router-dom'
import Routes from '../config/router'

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

const RouteContainer = () => (
  <Router>
    <App />
  </Router>
)

export default hot(module)(RouteContainer)
