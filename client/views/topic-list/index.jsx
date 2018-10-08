import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Helmet from 'react-helmet'
import queryString from 'query-string'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import List from '@material-ui/core/List'
import CircularProgress from '@material-ui/core/CircularProgress'
import { AppState, TopicStore } from '../../store/store'
import TopicListItem from './list-item'
import Container from '../layout/container'
import { tabLabels } from '../../utils/variable-define'

@inject(stores => ({
  appState: stores.appState,
  topicStore: stores.topicStore,
})) @observer
class TopicList extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.changeTab = this.changeTab.bind(this)
    this.clickListItem = this.clickListItem.bind(this)
  }

  componentDidMount() {
    const tab = this.getTab()
    const { topicStore } = this.props
    topicStore.fetchTopics(tab)
  }

  getTab() {
    const { location } = this.props
    const query = queryString.parse(location.search)
    return query.tab || 'all'
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

  changeTab(e, value) {
    const { router } = this.context
    const { topicStore } = this.props
    router.history.push({
      pathname: '/list',
      search: `?tab=${value}`,
    })
    topicStore.fetchTopics(value)
  }

  clickListItem(topic) {
    const { router } = this.context
    router.history.push(`/detail/${topic.id}`)
  }

  render() {
    const { topicStore } = this.props
    const { topics, loading } = topicStore
    const tabValue = this.getTab()
    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <Tabs value={tabValue} onChange={this.changeTab}>
          {
            tabLabels.map(tabLabel => (
              <Tab label={tabLabel} value={tabLabel} key={tabLabel} />
            ))
          }
        </Tabs>
        <List>
          {
            topics.map(topic => (
              <TopicListItem
                topic={topic}
                key={topic.id}
                onClick={() => this.clickListItem(topic)}
              />
            ))
          }
        </List>
        {
          loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '40px 0',
              }}
            >
              <CircularProgress color="primary" size={70} />
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

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
}

export default TopicList
