import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Avatar from '@material-ui/core/Avatar'
import { withStyles } from '@material-ui/core/styles'
import UserIcon from '@material-ui/icons/AccountCircle'
import Container from '../layout/container'
import userStyles from './styles/user-style'

@inject(stores => ({
  user: stores.appState.user,
})) @observer
class User extends React.Component {
  render() {
    const { classes, children, user } = this.props
    const { info } = user
    return (
      <Container>
        <div className={classes.avatar}>
          <div className={classes.bg} />
          {
            info.avatar_url
              ? <Avatar className={classes.avatarImg} src={info.avatar_url} />
              : (
                <Avatar className={classes.avatarImg}>
                  <UserIcon />
                </Avatar>
              )
          }
          <span className={classes.userName}>{info.loginname || 'Sign In'}</span>
        </div>
        {children}
      </Container>
    )
  }
}

User.wrappedComponent.propTypes = {
  user: PropTypes.object.isRequired,
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
}

export default withStyles(userStyles)(User)
