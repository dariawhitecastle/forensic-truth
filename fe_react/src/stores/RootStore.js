import { ignore } from 'mobx-sync'
import { application } from './applicationStore'

export class RootStore {
  @ignore storeLoaded = false
  application = application
}

export const store = new RootStore()
