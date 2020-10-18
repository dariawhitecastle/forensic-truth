import { action, observable, computed } from 'mobx';
import { createContext } from 'react';
import * as R from 'ramda';

import {
  getQuestions as getQuestionsService,
  fetchSubmission as fetchSubmissionService,
} from '../services/applicationServices';

export class ExaminerStore {
  @observable sectionList = [];
  @observable selectedSubmissionId = undefined;
  @observable currentSubmission = {};

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
  setSelectedSubmissionId(id) {
    this.selectedSubmissionId = id;
  }

  @action.bound
  async fetchSubmission() {
    try {
      const data = await fetchSubmissionService(this.selectedSubmissionId);
      this.setCurrentSubmission(data);
    } catch (err) {
      throw err;
    }
  }

  @action.bound
  setCurrentSubmission(submission) {
    this.currentSubmission = submission;
  }
}

export const examiner = new ExaminerStore();
export const ExaminerStoreContext = createContext(examiner);
