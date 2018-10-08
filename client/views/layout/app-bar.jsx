import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flexGrow: 1,
  },
  createButton: {
    margin: '0 5px',
  },
}

@inject(stores => ({
  appState: stores.appState,
})) @observer
class MainAppBar extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor() {
    super()
    this.onHomeIconClick = this.onHomeIconClick.bind(this)
    this.createButtonClick = this.createButtonClick.bind(this)
    this.loginButtonClick = this.loginButtonClick.bind(this)
  }

  onHomeIconClick() {
    const { router } = this.context
    router.history.push('/list')
  }

  createButtonClick() {
    const { router } = this.context
    router.history.push('/topic/create')
  }

  loginButtonClick() {
    const { router } = this.context
    const { appState } = this.props
    if (appState.user.isLogin) {
      router.history.push('/user/info')
    } else {
      router.history.push('/user/login')
    }
  }

  render() {
    const { classes, appState } = this.props // eslint-disable-line
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton color="inherit" onClick={this.onHomeIconClick}>
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              Stream
            </Typography>
            <Button variant="contained" color="secondary" onClick={this.createButtonClick} className={classes.createButton}>
              New Topic
            </Button>
            <Button variant="flat" color="inherit" onClick={this.loginButtonClick}>
              {
                appState.user.info.loginname || 'Sign In'
              }
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

MainAppBar.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
}

export default withStyles(styles)(MainAppBar)
