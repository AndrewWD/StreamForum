import React from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'
import Helmet from 'react-helmet'
import { inject, observer } from 'mobx-react'
import dataFormat from 'dataformat'
import SimpleMDE from 'react-simplemde-editor'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import IconReply from '@material-ui/icons/Reply'
import Container from '../layout/container'
import { topicDetailStyle } from './styles'
import Reply from './reply'

@inject(stores => ({
  topicStore: stores.topicStore,
  user: stores.appState.user,
})) @observer
class TopicDetail extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor() {
    super()
    this.state = {
      newReply: '',
    }
    this.handleNewReplyChange = this.handleNewReplyChange.bind(this)
    this.clickNotLoginButton = this.clickNotLoginButton.bind(this)
    this.doReply = this.doReply.bind(this)
  }
  componentDidMount() {
    const { match, topicStore } = this.props
    topicStore.getTopicDetail(match.params.id)
  }

  handleNewReplyChange(val) {
    this.setState({
      newReply: val,
    })
  }

  clickNotLoginButton() {
    const { router } = this.context
    router.history.push('/user/login')
  }

  doReply() {
    const { match, topicStore } = this.props
    const topic = topicStore.detailMap[match.params.id]
    const { newReply } = this.state
    topic.doReply(newReply)
      .then(() => {
        this.setState({
          newReply: '',
        })
      }).catch((err) => {
        console.log(err)
      })
  }

  render() {
    const { classes, topicStore, match, user } = this.props
    const { newReply } = this.state
    const topic = topicStore.detailMap[match.params.id]
    if (!topic) {
      return (
        <Container>
          <section className={classes.loadingContainer}>
            <CircularProgress color="primary" />
          </section>
        </Container>
      )
    }
    return (
      <div>
        <Container>
          <Helmet>
            <title>{topic.title}</title>
          </Helmet>
          <header className={classes.header}>
            <h3>{topic.title}</h3>
          </header>
          <section className={classes.body}>
            <p dangerouslySetInnerHTML={{ __html: marked(topic.content) }} />
          </section>
        </Container>

        {
          topic.myReplies && topic.myReplies.length !== 0
            ? (
              <Paper elevation={4} className={classes.replies}>
                <header className={classes.replyHeader}>
                  <span>My latest replies</span>
                  <span>{`${topic.replies.length} replies`}</span>
                </header>
                {
                  topic.myReplies.map(reply => (
                    <Reply
                      key={reply.id}
                      reply={Object.assign({}, reply, {
                        author: {
                          avatar_url: user.info.avatar_url,
                          loginname: user.info.loginname,
                        },
                      })}
                    />
                  ))
                }
              </Paper>
            )
            : null
        }

        <Paper elevation={4} className={classes.replies}>
          <header className={classes.replyHeader}>
            <span>{`${topic.reply_count} Replies`}</span>
            <span>{`Latest Reply ${dataFormat(topic.last_reply_at)}`}</span>
          </header>
          <section>
            {
              topic.replies.map(reply => <Reply reply={reply} key={reply.id} />)
            }
          </section>
          {
            user.isLogin
              ? (
                <section className={classes.replyEditor}>
                  <SimpleMDE
                    id="topic-detail"
                    onChange={this.handleNewReplyChange}
                    value={newReply}
                    options={{
                      toolbar: false,
                      autoFocus: false,
                      spellChecker: false,
                      placeholder: 'Your reply...',
                    }}
                  />
                  <Button variant="fab" color="secondary" onClick={this.doReply} className={classes.replyButton}>
                    <IconReply />
                  </Button>
                </section>
              )
              : (
                <section className={classes.notLoginButton}>
                  <Button variant="contained" color="secondary" onClick={this.clickNotLoginButton}>Login and Reply</Button>
                </section>
              )
          }
        </Paper>
      </div>
    )
  }
}

TopicDetail.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

TopicDetail.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(topicDetailStyle)(TopicDetail)
