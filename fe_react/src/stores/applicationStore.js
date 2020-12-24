import { action, observable, computed, makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import { persist } from 'mobx-persist'
import * as R from 'ramda';

import {
  getQuestions as getQuestionsService,
  authenticate as authService,
  submitApplication as submitApplicationService,
} from '../services/applicationServices';

export class ApplicationStore {
  @persist('list') @observable sectionList = [];
  @persist('object') @observable personalInfo = {};
  @persist @observable disableNext = true;
  @persist @observable loginError = false;
  @persist @observable submitApplicationError = false; 
  @persist @observable questionServicePending = true

  constructor() {
      makeAutoObservable(this)
    }

  @computed
  get sortedSectionList() {
    // const sortById = R.sortBy(R.prop('id'));
    const mapSections = ({ id, name: title, question }) => {
      // const sortedQuestions = R.sortBy(R.prop('order'))(question);
      return {
        id,
        title,
        questions: question,
        component: 'SingleStepForm',
      };
    };
    // return R.compose(R.map(mapSections), sortById)(this.sectionList);
     return R.map(mapSections)(this.sectionList);
  }

  @action
  setQuestions = (payload) => {
    this.sectionList = payload;
  }

  @action
  updateQuestions = (questionId, updatedQuestions) => { 
    const idx = R.findIndex(R.propEq('id', questionId), this.sectionList)
    const updatedSection = R.assoc('question', updatedQuestions, this.sectionList[idx])
    this.sectionList = R.update(idx, updatedSection, this.sectionList)
  }

   @action 
   getQuestions = async () => {
     const data = await getQuestionsService();
    this.questionServicePending = false
    this.setQuestions(data);
  }

  @action
  resetForm = () => {
    this.personalInfo = {};
  }

  @action
  setPersonalInfo =({  field, value}) => {
    if (!value) return delete this.personalInfo[field];
    
    this.personalInfo = R.assoc(field, value, this.personalInfo)
    
  }

  @action
  setDisableNext = (payload) =>  {
    this.disableNext = payload;
  }

  @action
  setLoginError = (payload) => {
    this.loginError = payload;
  }

  @action
  setSubmitApplicationError = (payload) =>  {
    this.submitApplicationError = payload;
  }

  @action
  handleLogin = async (payload) => {
    try {
      await authService(payload);
    } catch (err) {
      this.setLoginError(true);
    }
  }
  @action 
  submitApplication = async(payload) => {
    try {
      await submitApplicationService(payload);
    } catch (err) {
      this.setSubmitApplicationError(true);
    }
  }
}

export const application = new ApplicationStore();
export const ApplicationStoreContext = createContext(application);
