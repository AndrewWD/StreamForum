import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Helmet from 'react-helmet'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import List from '@material-ui/core/List'
import CircularProgress from '@material-ui/core/CircularProgress'
import { AppState, TopicStore } from '../../store/store'
import TopicListItem from './list-item'
import Container from '../layout/container'

@inject(stores => ({
  appState: stores.appState,
  topicStore: stores.topicStore,
})) @observer
class TopicList extends Component {
  constructor() {
    super()
    this.state = {
      tabIndex: 0,
      tabLabels: ['All', 'Share', 'Job', 'Ask', 'Top', 'Test'],
    }
    this.changeTab = this.changeTab.bind(this)
    this.clickListItem = this.clickListItem.bind(this)
  }

  componentDidMount() {
    const { topicStore } = this.props
    topicStore.fetchTopics()
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
    const { topicStore } = this.props
    const { tabIndex, tabLabels } = this.state
    const tabList = tabLabels.map(tabLabel => (
      <Tab label={tabLabel} key={tabLabel} />
    ))
    const { topics, loading } = topicStore
    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <Tabs value={tabIndex} onChange={this.changeTab}>
          {tabList}
        </Tabs>
        <List>
          {
            topics.map(topic => (
              <TopicListItem topic={topic} key={topic.id} onClick={this.clickListItem} />
            ))
          }
        </List>
        {
          loading ? (
            <div>
              <CircularProgress color="secondary" size={100} />
            </div>
          ) : null
        }

      </Container>
    )
  }
}

TopicList.wrappedComponent.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired,
  topicStore: PropTypes.instanceOf(TopicStore).isRequired,
}

export default TopicList
