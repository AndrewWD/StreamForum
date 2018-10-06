import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Helmet from 'react-helmet'
import Button from '@material-ui/core/Button'
import AppState from '../../store/app-state'

@inject('appState') @observer
class TopicList extends Component {
  static propTypes = {
    appState: PropTypes.instanceOf(AppState).isRequired,
  }

  constructor() {
    super()
    this.changeName = this.changeName.bind(this)
  }

  componentDidMount() {

  }

  bootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { appState } = this.props
        appState.count = 3
        resolve(true)
      })
    })
  }

  changeName(e) {
    const { appState } = this.props
    appState.name = e.target.value
  }

  render() {
    const { appState } = this.props
    return (
      <div>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <Button variant="contained" color="secondary">This is a test button</Button>
        <input onChange={this.changeName} />
        <div>{appState.msg}</div>
      </div>
    )
  }
}

export default TopicList
