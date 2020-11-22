import { action, observable, computed } from 'mobx';
import { persist , create } from 'mobx-persist'
import { createContext } from 'react';
import * as R from 'ramda';

import {
  getQuestions as getQuestionsService,
  fetchSubmission as fetchSubmissionService,
  submitNotes as submitNotesService,
  fetchAllSubmissions  as fetchAllSubmissionsService
} from '../services/applicationServices';

const hydrate = create({})

export class ExaminerStore {
  @observable hydrated = false;
  @persist('list') @observable sectionList = [];
  @persist @observable selectedSubmissionId;
  @persist('object') @observable currentSubmission = {};
  @persist('object') @observable notes = {};
  @persist('list') @observable allSubmissions = [];

  constructor() {
    hydrate('examiner', this).then(() => {
      this.hydrated = true;
    });
  }

  @computed get sortedAnswers() {
    if (!R.isEmpty(this.currentSubmission)) {
      const groupedById = R.groupBy(
        R.view(R.lensPath(['question', 'section', 'id']))
      );

      const groupedByAnswerGroup = R.groupBy(
        R.view(R.lensPath(['question', 'answerGroup']))
      );

      return R.compose(
        R.map(groupedByAnswerGroup),
        groupedById
      )(this.currentSubmission.answer);
    }
    return [];
  }

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
  setAllSubmissions(payload) { 
    this.allSubmissions = payload
  }

  @action.bound
  async fetchAllSubmissions() { 
    const data = await fetchAllSubmissionsService()
    this.setAllSubmissions(data)
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
      this.setCurrentSubmission(data[0]);
    } catch (err) {
      throw err;
    }
  }

  @action.bound
  setCurrentSubmission(submission) {
    this.currentSubmission = submission;
  }

  @action.bound
  setNotes(answerGroup, note) {
    this.notes = { ...this.notes, [answerGroup]: note };
    console.log('notes', JSON.parse(JSON.stringify(this.notes)))
  }

  @action.bound
  async submitNotes() { 
    try {
      await submitNotesService({ [this.selectedSubmissionId]: this.notes })
      return true
    } catch (err) { 
      throw err;
    }
  }
}

export const examiner = new ExaminerStore();
export const ExaminerStoreContext = createContext(examiner);