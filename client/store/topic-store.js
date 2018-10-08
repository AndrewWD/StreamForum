import { observable, extendObservable, action, computed } from 'mobx'
import { topicSchema, replySchema } from '../utils/variable-define'
import { get, post } from '../utils/http'

const fillTopicFields = topic => (
  Object.assign({}, topicSchema, topic)
)

const createReply = reply => (
  Object.assign({}, replySchema, reply)
)

class Topic {
  constructor(data) {
    extendObservable(this, data)
  }
  @observable myReplies = []
  @action doReply(content) {
    return new Promise((resolve, reject) => {
      post(`topic/${this.id}/replies`, {
        needAccessToken: true,
      }, { content })
        .then((resp) => {
          if (resp.success) {
            this.myReplies.push(createReply({
              id: resp.reply_id,
              content,
              create_at: Date.now(),
            }))
            resolve()
          } else {
            reject(resp)
          }
        }).catch(reject)
    })
  }
}

class TopicStore {
  @observable topics
  @observable details
  @observable loading
  @observable createdTopics = []

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
          this.topics = resp.data.map(topic => new Topic(fillTopicFields(topic)))
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

  @action createTopic(title, content, tab) {
    return new Promise((resolve, reject) => {
      post('/topics', {
        needAccessToken: true,
      }, { title, content, tab })
        .then((resp) => {
          if (resp.success) {
            const topic = {
              title,
              content,
              tab,
              id: resp.topic_id,
              create_at: Date.now(),
            }
            this.createdTopics.push(new Topic(fillTopicFields(topic)))
            resolve()
          } else {
            reject()
          }
        }).catch(reject)
    })
  }
}

export default TopicStore
