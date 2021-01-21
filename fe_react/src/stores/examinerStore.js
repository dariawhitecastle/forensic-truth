import { action, observable, computed, makeAutoObservable } from 'mobx';
import { persist, create } from 'mobx-persist';
import { createContext } from 'react';
import * as R from 'ramda';

import {
  getQuestions as getQuestionsService,
  fetchSubmission as fetchSubmissionService,
  submitNotes as submitNotesService,
  fetchAllSubmissions as fetchAllSubmissionsService,
} from '../services/applicationServices';

const hydrate = create({
  storage: Window.sessionStorage,
});

export class ExaminerStore {
  @observable hydrated = false;
  @persist('list') @observable sectionList = [];
  @persist @observable selectedSubmissionId;
  @persist('object') @observable currentSubmission = {};
  @persist('object') @observable notes = {};
  @persist('list') @observable allSubmissions = [];
  @observable notesError = false;

  constructor() {
    makeAutoObservable(this);
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

  @computed get notesByAnswerGroup() {
    if (!R.isEmpty(this.currentSubmission)) {
      return R.uniqBy(R.prop('answerGroup'))(this.currentSubmission.note);
    }
    return [];
  }

  @action
  setQuestions = (payload) => {
    this.sectionList = payload;
  };

  @action
  setAllSubmissions = (payload) => {
    this.allSubmissions = R.sortBy(R.prop('date'), payload);
  };

  @action
  fetchAllSubmissions = async () => {
    const data = await fetchAllSubmissionsService();
    this.setAllSubmissions(data);
  };

  @action
  getQuestions = async () => {
    const data = await getQuestionsService();
    this.setQuestions(data);
  };

  @action
  setSelectedSubmissionId = (id) => {
    this.selectedSubmissionId = id;
  };

  @action
  fetchSubmission = async () => {
    try {
      const data = await fetchSubmissionService(this.selectedSubmissionId);
      this.setCurrentSubmission(data[0]);
    } catch (err) {
      throw err;
    }
  };

  @action
  setCurrentSubmission = (submission) => {
    this.currentSubmission = submission;
  };

  @action
  setNotes = (answerGroup, note) => {
    this.notes = { ...this.notes, [answerGroup]: note };
  };

  @action
  setNotesError = (payload) => {
    this.notesError = payload;
  };

  @action
  resetNotes = () => {
    this.notes = {};
  };

  @action
  submitNotes = async () => {
    const createRequestObj = (note) => {
      const answerGroup = note[0];
      const body = note[1];
      return body
        ? {
            answerGroup,
            body,
            submissionId: this.selectedSubmissionId,
          }
        : undefined;
    };
    const requestBody = R.compose(
      R.map(createRequestObj),
      R.filter((pair) => !R.isNil(pair[1])),
      R.toPairs
    )(this.notes);

    try {
      await submitNotesService(requestBody);
      this.resetNotes();
      this.setNotesError(false);
      return true;
    } catch (err) {
      this.setNotesError(true);
    }
  };
}

export const examiner = new ExaminerStore();
export const ExaminerStoreContext = createContext(examiner);
