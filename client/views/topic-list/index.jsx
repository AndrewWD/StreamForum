import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Helmet from 'react-helmet'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
// import AppState from '../../store/app-state'
import TopicListItem from './list-item'
import Container from '../layout/container'

@inject('appState') @observer
class TopicList extends Component {
  // static propTypes = {
  //   appState: PropTypes.instanceOf(AppState).isRequired,
  // }

  constructor() {
    super()
    this.state = {
      tabIndex: 0,
      tabLabels: ['All', 'Share', 'Jobs', 'Q&A', 'Top', 'Test'],
    }
    this.changeTab = this.changeTab.bind(this)
    this.clickListItem = this.clickListItem.bind(this)
  }

  componentDidMount() {

  }

  // bootstrap() {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const { appState } = this.props
  //       appState.count = 3
  //       resolve(true)
  //     })
  //   })
  // }

  changeTab(e, index) {
    this.setState({
      tabIndex: index,
    })
  }
  /* eslint-disable */
  clickListItem() {

  }
  /* eslint-enable */

  render() {
    // const { appState } = this.props
    const { tabIndex, tabLabels } = this.state
    const tabList = tabLabels.map(tabLabel => (
      <Tab label={tabLabel} key={tabLabel} />
    ))
    const topic = {
      title: 'This is title',
      username: 'Andrew',
      reply_count: 20,
      visit_count: 3,
      create_at: '18:30',
      tab: 'Share',
    }
    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <Tabs value={tabIndex} onChange={this.changeTab}>
          {tabList}
        </Tabs>
        <TopicListItem topic={topic} onClick={this.clickListItem} />
      </Container>
    )
  }
}

export default TopicList
