import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import TopicList from '../views/topic-list/index'
import TopicDetail from '../views/topic-detail/index'
import TestApi from '../views/test/api-test'
import UserLogin from '../views/user/login'

export default () => [
  <Route path="/" render={() => <Redirect to="/list" />} key="first" exact />,
  <Route path="/list" component={TopicList} key="list" />,
  <Route path="/detail/:id" component={TopicDetail} key="detail" />,
  <Route path="/test" component={TestApi} key="test" />,
  <Route path="/user/login" component={UserLogin} key="login" />,
]
