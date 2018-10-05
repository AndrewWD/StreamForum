import { observable, computed, action } from 'mobx'

export default class AppState {
  constructor({ count, name } = { count: 0, name: 'Andrew' }) {
    this.name = name
    this.count = count
  }
  @observable name
  @observable count
  @computed get msg() {
    return `My name is ${this.name} ${this.count}`
  }
  @action add() {
    this.count += 1
  }

  toJson() {
    return {
      count: this.count,
      name: this.name,
    }
  }
}
