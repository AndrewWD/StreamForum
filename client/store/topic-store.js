import { observable, extendObservable, action, computed } from 'mobx'
import { topicSchema } from '../utils/variable-define'
import { get } from '../utils/http'

class Topic {
  constructor(data) {
    extendObservable(this, data)
  }
}

const fillTopicFields = topic => (
  Object.assign({}, topicSchema, topic)
)

class TopicStore {
  @observable topics
  @observable details
  @observable loading

  constructor({ topics = [], details = [], loading = false } = {}) {
    this.topics = topics.map(topic => new Topic(fillTopicFields(topic)))
    this.details = details.map(detail => new Topic(fillTopicFields(detail)))
    this.loading = loading
  }

  @computed get detailMap() {
    return this.details.reduce((result, detail) => {
      result[detail.id] = detail // eslint-disable-line
      return result
    }, {})
  }

  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      this.loading = true
      this.topics = []
      get('topics', {
        mdrender: false,
        tab,
      }).then((resp) => {
        if (resp.success) {
          resp.data.forEach((topic) => {
            this.topics.push(new Topic(fillTopicFields(topic)))
          })
          resolve()
        } else {
          reject()
        }
        this.loading = false
      }).catch((err) => {
        reject(err)
        this.loading = false
      })
    })
  }

  @action getTopicDetail(id) {
    return new Promise((resolve, reject) => {
      if (this.detailMap[id]) {
        resolve(this.detailMap[id])
      } else {
        get(`/topic/${id}`, {
          mdrender: false,
        }).then((resp) => {
          if (resp.success) {
            const topicDetail = new Topic(fillTopicFields(resp.data))
            this.details.push(topicDetail)
            resolve(topicDetail)
          } else {
            reject()
          }
        }).catch(reject)
      }
    })
  }
}

export default TopicStore
