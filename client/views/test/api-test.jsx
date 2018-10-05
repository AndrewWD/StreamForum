import React from 'react'
import axios from 'axios'

export default class TestApi extends React.Component {
  static getTopics() {
    axios.get('/api/topics')
      .then(resp => console.log(resp))
      .catch(err => console.log(err))
  }

  static login() {
    axios.post('api/user/login', {
      accessToken: '7937e9de-493e-47d4-ae82-d440d449aed7',
    }).then(resp => console.log(resp))
      .catch(err => console.log(err))
  }

  static markAll() {
    axios.post('api/message/mark_all?needAccessToken=true')
      .then(resp => console.log(resp))
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        <button type="button" onClick={TestApi.getTopics}>Topics</button>
        <button type="button" onClick={TestApi.login}>Login</button>
        <button type="button" onClick={TestApi.markAll}>Mark All</button>
      </div>
    )
  }
}
