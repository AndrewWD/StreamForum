import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import queryString from 'query-string'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import UserWrapper from './user'
import loginStyles from './styles/login-style'

@inject(stores => ({
  appState: stores.appState,
  user: stores.appState.user,
})) @observer
class UserLogin extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      accesstoken: '',
      helpText: '',
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  componentWillMount() {
    const { user } = this.props
    const { router } = this.context
    if (user.isLogin) {
      router.history.replace('/user/info')
    }
  }

  getFrom() {
    const { location } = this.props
    const query = queryString.parse(location.search)
    return query.from || '/list'
  }

  handleInput(e) {
    this.setState({
      accesstoken: e.target.value.trim(),
    })
  }

  handleLogin() {
    const { accesstoken } = this.state
    const { appState } = this.props
    if (!accesstoken) {
      this.setState({
        helpText: 'AccessToken is Required',
      })
    } else {
      this.setState({
        helpText: '',
      })
      appState.login(accesstoken)
        .catch((err) => {
          console.log(err)
        })
    }
  }

  render() {
    const { classes, user } = this.props
    const { helpText, accesstoken } = this.state
    const from = this.getFrom()
    if (user.isLogin) {
      return <Redirect to={from} />
    }
    return (
      <UserWrapper>
        <div className={classes.root}>
          <TextField
            lable="CNode AccessToken"
            placeholder="Please Enter the CNode AccessToken"
            required
            helperText={helpText}
            value={accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            Login
          </Button>
        </div>
      </UserWrapper>
    )
  }
}

UserLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

UserLogin.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

export default withStyles(loginStyles)(UserLogin)
