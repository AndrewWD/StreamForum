import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import { withStyles } from '@material-ui/core/styles'
import { topicPrimaryStyle, topicSecondaryStyle } from './styles'

const Primary = ({ classes, topic }) => (
  <div className={classes.root}>
    <span className={classes.tab}>{topic.tab}</span>
    <span className={classes.title}>{topic.title}</span>
  </div>
)

Primary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

const Secondary = ({ classes, topic }) => (
  <span className={classes.root}>
    <span className={classes.userName}>{topic.username}</span>
    <span className={classes.count}>
      <span className={classes.replyCount}>{topic.reply_count}</span>
      <span>/</span>
      <span>{topic.visit_count}</span>
    </span>
    <span>{`created time: ${topic.create_at}`}</span>
  </span>
)

Secondary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

const StyledPrimary = withStyles(topicPrimaryStyle)(Primary)
const StyledSecondary = withStyles(topicSecondaryStyle)(Secondary)

const TopicListItem = ({ onClick, topic }) => (
  <ListItem button onClick={onClick}>
    <ListItemAvatar>
      <Avatar src={topic.image} />
    </ListItemAvatar>
    <ListItemText
      primary={<StyledPrimary topic={topic} />}
      secondary={<StyledSecondary topic={topic} />}
    />
  </ListItem>
)

TopicListItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  topic: PropTypes.object.isRequired,
}

export default TopicListItem
