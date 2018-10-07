import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import Routes from '../config/router'
import AppBar from './layout/app-bar'

export default class App extends Component {
  componentDidMount() {

  }

  render() {
    return [
      <AppBar key="appbar" />,
      <Routes key="routes" />,
    ]
  }
}
