import { observable, action, toJS } from 'mobx'
import { post, get } from '../utils/http'

export default class AppState {
  @observable user = {
    isLogin: false,
    info: {},
    detail: {
      recentTopics: [],
      recentReplies: [],
    },
    collections: {
      list: [],
    },
  }

  init({ user }) {
    if (user) {
      this.user = user
    }
  }

  @action login(accessToken) {
    return new Promise((resolve, reject) => {
      post('user/login', {}, {
        accessToken,
      }).then((resp) => {
        if (resp.success) {
          this.user.isLogin = true
          this.user.info = resp.data
          resolve()
        } else {
          reject()
        }
      }).catch(reject)
    })
  }

  @action getUserDetail() {
    return new Promise((resolve, reject) => {
      get(`user/${this.user.info.loginname}`)
        .then((resp) => {
          if (resp.success) {
            this.user.detail.recentReplies = resp.data.recent_replies
            this.user.detail.recentTopics = resp.data.recent_topics
            resolve()
          } else {
            reject()
          }
        }).catch((err) => {
          reject(err)
        })
    })
  }

  @action getUserCollection() {
    return new Promise((resolve, reject) => {
      get(`topic_collect/${this.user.info.loginname}`)
        .then((resp) => {
          if (resp.success) {
            this.user.collections.list = resp.data
            resolve()
          } else {
            reject()
          }
        }).catch((err) => {
          reject(err)
        })
    })
  }

  toJSON() {
    return {
      user: toJS(this.user),
    }
  }
}
