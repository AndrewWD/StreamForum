import { observable, action } from 'mobx'
import { post, get } from '../utils/http'

export default class AppState {
  @observable user = {
    isLogin: false,
    info: {},
    detail: {
      recentTopics: [],
      recentReplies: [],
      loading: false,
    },
    collections: {
      list: [],
      loading: false,
    },
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
    this.user.detail.loading = true
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
          this.user.detail.loading = false
        }).catch((err) => {
          this.user.detail.laoding = false
          reject(err)
        })
    })
  }

  @action getUserCollection() {
    this.user.collections.loading = true
    return new Promise((resolve, reject) => {
      get(`topic_collect/${this.user.info.loginname}`)
        .then((resp) => {
          if (resp.success) {
            this.user.collections.list = resp.data
            resolve()
          } else {
            reject()
          }
          this.user.collections.loading = false
        }).catch((err) => {
          this.user.collections.laoding = false
          reject(err)
        })
    })
  }
}
