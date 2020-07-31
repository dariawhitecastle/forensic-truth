import { action, observable, computed } from 'mobx';
import { createContext } from 'react';
import * as R from 'ramda';

import { getQuestions as getQuestionsService } from '../services/applicationServices';

export class ApplicationStore {
  @observable sectionList = [];
  @observable personalInfo = {};
  @observable disableNext = true;

  @computed get sortedSectionList() {
    const sortById = R.sortBy(R.prop('id'));
    const mapSections = ({ id, name: title, question }) => {
      const sortedQuestions = R.sortBy(R.prop('order'))(question);
      return {
        id,
        title,
        questions: sortedQuestions,
        component: 'SingleStepForm',
      };
    };
    return R.compose(R.map(mapSections), sortById)(this.sectionList);
  }

  @action.bound
  setQuestions(payload) {
    this.sectionList = payload;
  }

  @action.bound
  async getQuestions() {
    const data = await getQuestionsService();
    this.setQuestions(data);
  }

  @action.bound
  setPersonalInfo({ field, value }) {
    console.log(field, value);

    if (!value) return delete this.personalInfo[field];
    this.personalInfo = { ...this.personalInfo, [field]: value };
  }

  @action.bound
  setDisableNext(payload) {
    this.disableNext = payload;
  }
}

export const application = new ApplicationStore();
export const ApplicationStoreContext = createContext(application);
