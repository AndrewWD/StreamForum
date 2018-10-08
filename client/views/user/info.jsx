import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import dataFormat from 'dataformat'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import UserWrapper from './user'
import infoStyles from './styles/user-info-style'

const TopicItem = ({ topic, onClick }) => (
  <ListItem button onClick={onClick}>
    <Avatar src={topic.author.avatar_url} />
    <ListItemText
      primary={topic.title}
      secondary={`Latest Reply: ${dataFormat(topic.last_reply_at)}`}
    />
  </ListItem>
)

TopicItem.propTypes = {
  topic: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}

@inject(stores => ({
  user: stores.appState.user,
  appState: stores.appState,
})) @observer
class UserInfo extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.onClickTopic = this.onClickTopic.bind(this)
  }

  componentWillMount() {
    const { appState } = this.props
    appState.getUserDetail()
    appState.getUserCollection()
  }

  onClickTopic(id) {
    const { router } = this.context
    router.history.push(`/detail/${id}`)
  }

  render() {
    const { classes, user } = this.props
    const topics = user.detail.recentTopics
    const replies = user.detail.recentReplies
    const collections = user.collections.list
    return (
      <UserWrapper>
        <div className={classes.root}>
          <Grid container spacing={16} align="stretch">
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>Recent Topics</span>
                </Typography>
                <List>
                  {
                    topics.length > 0
                      ? topics.map(topic => (
                        <TopicItem
                          topic={topic}
                          key={topic.id}
                          onClick={() => this.onClickTopic(topic.id)}
                        />
                      ))
                      : (
                        <Typography align="center">
                          No topics
                        </Typography>
                      )
                  }
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>New Reply</span>
                </Typography>
                <List>
                  {
                    replies.length > 0
                      ? replies.map(topic => (
                        <TopicItem
                          topic={topic}
                          key={topic.id}
                          onClick={() => this.onClickTopic(topic.id)}
                        />))
                      : (
                        <Typography align="center">
                          No new reply
                        </Typography>
                      )
                  }
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>My Collections</span>
                </Typography>
                <List>
                  {
                    collections.length > 0
                      ? collections.map(topic => (
                        <TopicItem
                          topic={topic}
                          key={topic.id}
                          onClick={() => this.onClickTopic(topic.id)}
                        />))
                      : (
                        <Typography align="center">
                          No collection
                        </Typography>
                      )
                  }
                </List>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </UserWrapper>
    )
  }
}

UserInfo.wrappedComponent.propTypes = {
  user: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
}

UserInfo.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(infoStyles)(UserInfo)
