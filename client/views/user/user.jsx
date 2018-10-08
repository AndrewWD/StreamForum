import React from 'react'
import PropTypes from 'prop-types'
// import { inject, observer } from 'mobx-react'
import Avatar from '@material-ui/core/Avatar'
import { withStyles } from '@material-ui/core/styles'
import UserIcon from '@material-ui/icons/AccountCircle'
import Container from '../layout/container'
import userStyles from './styles/user-style'

class User extends React.Component {
  componentDidMount() {

  }

  render() {
    const { classes, children } = this.props
    const user = {}
    return (
      <Container>
        <div className={classes.avatar}>
          <div className={classes.bg} />
          {
            user.avatar_url
              ? <Avatar className={classes.avatarImg} src={user.avatar_url} />
              : (
                <Avatar className={classes.avatarImg}>
                  <UserIcon />
                </Avatar>
              )
          }
          <span className={classes.userName}>{user.loginname || 'Sign In'}</span>
        </div>
        {children}
      </Container>
    )
  }
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
}

export default withStyles(userStyles)(User)
