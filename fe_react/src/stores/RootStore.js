import { application } from './applicationStore';
import { examiner } from './examinerStore';

export class RootStore {
  application = application;
  examiner = examiner;
}

export const rootStore = new RootStore();




