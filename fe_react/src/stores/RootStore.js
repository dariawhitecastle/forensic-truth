import { ignore } from 'mobx-sync';
import { application } from './applicationStore';
import { examiner } from './examinerStore';

export class RootStore {
  @ignore storeLoaded = false;
  application = application;
  examiner = examiner;
}

export const store = new RootStore();
