import { action, observable, computed, makeAutoObservable, toJS } from 'mobx';
import { persist, create } from 'mobx-persist';
import { createContext } from 'react';
import { sortAnswerByOrder } from '../utils/helpers';
import * as R from 'ramda';

import {
  getQuestions as getQuestionsService,
  fetchSubmission as fetchSubmissionService,
  fetchAllSubmissions as fetchAllSubmissionsService,
} from '../services/applicationServices';

import {
  submitNotes as submitNotesService,
  submitReport as submitReportService,
} from '../services/examinerServices';

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
  @persist('object') @observable report = {};
  @observable notesError = false;
  @observable apiError = false;
  @observable reportError = false;

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

      const sortByQuestionOrder = (obj) => {
        obj[3] = sortAnswerByOrder(obj[3], [11, 13]);
        obj[4] = sortAnswerByOrder(obj[4], [14]);
        obj[5] = sortAnswerByOrder(obj[5], [20]);
        return obj;
      };

      return R.compose(
        sortByQuestionOrder,
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
  setApiError = (payload) => {
    this.apiError = payload;
  };

  @action
  fetchAllSubmissions = async () => {
    const data = await fetchAllSubmissionsService(this.setApiError);
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
    this.report = { submissionId: this.selectedSubmissionId, notes: [] };

    try {
      const data = await fetchSubmissionService(this.selectedSubmissionId);
      this.setCurrentSubmission(data[0]);
      this.setReport({ submissionId: this.selectedSubmissionId });
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
    this.setNotesError(false);
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
      return true;
    } catch (err) {
      this.setNotesError(true);
      return false;
    }
  };

  @action
  setReport = (label, value, type) => {
    console.log(toJS(this.report));
    if (type === 'section') {
      this.report.reportSection = {
        ...this.report.reportSection,
        [label]: value,
      };
    } else {
      if (!this.report.notes.length) {
        return this.report.notes.push({ questionId: label, body: value });
      }

      const foundIdx = this.report.notes.findIndex(
        (note) => note.questionId === label
      );

      const updatedNote = {
        questionId: label,
        body: value,
      };

      if (foundIdx) {
        this.report.notes = R.update(foundIdx, updatedNote, this.report.notes);
      } else {
        this.report.notes.push(updatedNote);
      }
    }
  };

  @action
  resetReport = () => {
    this.report = {};
  };

  @action
  setReportError = (payload) => {
    this.reportError = payload;
  };

  @action
  submitReport = async () => {
    console.log(toJS(this.report));
    try {
      await submitReportService(this.report);
      this.resetReport();
      return true;
    } catch (err) {
      this.setReportError(true);
      return false;
    }
  };
}

export const examiner = new ExaminerStore();
export const ExaminerStoreContext = createContext(examiner);
