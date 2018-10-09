import React from 'react'
import SimpleMDE from 'react-simplemde-editor'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SnackBar from '@material-ui/core/Snackbar'
// import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import { withStyles } from '@material-ui/core/styles'
import Container from '../layout/container'
import createStyles from './styles'
import { tabLabels } from '../../utils/variable-define'

@inject(stores => ({
  topicStore: stores.topicStore,
})) @observer
class TopicCreate extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      title: '',
      content: '',
      selectedTab: 'dev',
      open: false,
      message: '',
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value.trim(),
    })
  }

  handleContentChange(val) {
    this.setState({
      content: val,
    })
  }

  handleTabChange(e) {
    this.setState({
      selectedTab: e.currentTarget.value,
    })
  }

  handleCreate() {
    const { title, content, selectedTab } = this.state
    const { topicStore } = this.props
    const { router } = this.context
    if (!title) {
      this.showMessage('Title is Required!')
      return
    }
    if (!content) {
      this.showMessage('Content is Required!')
      return
    }
    topicStore.createTopic(title, content, selectedTab)
      .then(() => {
        router.history.push('/list')
      }).catch((err) => {
        this.showMessage(err.message)
      })
  }

  showMessage(message) {
    this.setState({
      open: true,
      message,
    })
  }

  handleClose() {
    this.setState({
      open: false,
    })
  }

  render() {
    const { classes } = this.props
    const { title, content, selectedTab, message, open } = this.state
    return (
      <Container>
        <SnackBar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          message={message}
          open={open}
          onRequestClose={this.handleClose}
        />
        <div className={classes.root}>
          <TextField
            className={classes.title}
            label="Title"
            value={title}
            onChange={this.handleTitleChange}
          />
          <SimpleMDE
            id="topic-create"
            onChange={this.handleContentChange}
            value={content}
            options={{
              toolbar: false,
              spellChecker: false,
              placeholder: 'Write your topic...',
            }}
          />
          <RadioGroup
            row
            value={selectedTab}
            onChange={this.handleTabChange}
          >
            {
              tabLabels.map((tab) => {
                if (tab !== 'all' && tab !== 'good') {
                  return (
                    <FormControlLabel value={tab} control={<Radio />} label={tab} key={tab} />
                  )
                }
                return null
              })
            }
          </RadioGroup>
          <Button variant="contained" color="secondary" onClick={this.handleCreate} className={classes.createButton}>
            Create
          </Button>
        </div>
      </Container>
    )
  }
}

TopicCreate.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
}

TopicCreate.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(createStyles)(TopicCreate)
