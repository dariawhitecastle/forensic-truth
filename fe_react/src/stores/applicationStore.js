import { action, observable, computed } from 'mobx';
import { createContext } from 'react';
import * as R from 'ramda';

import {
  getQuestions as getQuestionsService,
  authenticate as authService,
  submitApplication as submitApplicationService,
} from '../services/applicationServices';

export class ApplicationStore {
  @observable sectionList = [];
  @observable personalInfo = {};
  @observable disableNext = true;
  @observable loginError = false;
  @observable submitApplicationError = false;

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
    if (!value) return delete this.personalInfo[field];
    this.personalInfo = R.assoc(field, value, this.personalInfo);
  }

  @action.bound
  setDisableNext(payload) {
    this.disableNext = payload;
  }

  @action.bound
  setLoginError(payload) {
    this.loginError = payload;
  }

  @action.bound
  setSubmitApplicationError(payload) {
    this.submitApplicationError = payload;
  }

  @action.bound
  async handleLogin(payload) {
    try {
      await authService(payload);
    } catch (err) {
      this.setLoginError(true);
    }
  }
  @action.bound
  async submitApplication(payload) {
    try {
      await submitApplicationService(payload);
    } catch (err) {
      this.setSubmitApplicationError(true);
    }
  }
}

export const application = new ApplicationStore();
export const ApplicationStoreContext = createContext(application);
