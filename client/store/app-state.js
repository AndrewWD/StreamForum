import { observable, computed, action } from 'mobx'

export class AppState {
  @observable name = 'Andrew'
  @observable count = 0
  @computed get msg() {
    return `My name is ${this.name} ${this.count}`
  }
  @action add() {
    this.count += 1
  }
}

const appState = new AppState()

export default appState
