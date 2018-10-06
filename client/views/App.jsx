import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Routes from '../config/router'

export default class App extends Component {
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
