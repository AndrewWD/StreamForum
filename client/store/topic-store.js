import { observable, extendObservable, action } from 'mobx'
import { topicSchema } from '../utils/variable-define'
import { get } from '../utils/http'

class Topic {
  constructor(data) {
    extendObservable(this, data)
  }
  @observable loading = false
}

const fillTopicFields = topic => (
  Object.assign({}, topicSchema, topic)
)

class TopicStore {
  @observable topics
  @observable loading

  constructor({ topics, loading } = { topics: [], loading: false }) {
    this.topics = topics.map(topic => new Topic(fillTopicFields(topic)))
    this.loading = loading
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
}

export default TopicStore
