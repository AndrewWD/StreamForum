import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import TopicList from '../views/topic-list/index'
import TopicDetail from '../views/topic-detail/index'
import TopicCreate from '../views/topic-create/index'
import UserLogin from '../views/user/login'
import UserInfo from '../views/user/info'

const PrivateRoute = ({ isLogin, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
      props => (
        isLogin
          ? (
            <Component {...props} />
          )
          : (
            <Redirect
              to={{
                pathname: '/user/login',
                search: `?from=${rest.path}`,
              }}
            />
          ))
    }
  />
)

PrivateRoute.propTypes = {
  isLogin: PropTypes.bool,
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]).isRequired,
}

PrivateRoute.defaultProps = {
  isLogin: false,
}

const InjectedPrivateRoute = withRouter(inject(stores => ({
  isLogin: stores.appState.user.isLogin,
}))(observer(PrivateRoute)))

export default () => [
  <Route path="/" render={() => <Redirect to="/list" />} key="first" exact />,
  <Route path="/list" component={TopicList} key="list" />,
  <Route path="/detail/:id" component={TopicDetail} key="detail" />,
  <Route path="/user/login" component={UserLogin} key="login" />,
  <InjectedPrivateRoute path="/user/info" component={UserInfo} key="info" />,
  <InjectedPrivateRoute path="/topic/create" component={TopicCreate} key="create" />,
]
