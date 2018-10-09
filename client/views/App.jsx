import React, { Component } from 'react'
import { hot } from 'react-hot-loader' // eslint-disable-line
import Routes from '../config/router'
import AppBar from './layout/app-bar'

class App extends Component {
  componentDidMount() {

  }

  render() {
    return [
      <AppBar key="appbar" />,
      <Routes key="routes" />,
    ]
  }
}

export default hot(module)(App)
