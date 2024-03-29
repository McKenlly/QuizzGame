import produce from 'immer';
import { setLoaderAction, stopLoaderAction } from '../loader';
import { showPopUpAction } from '../pop-up';
import { checkFetchError, fetchApi, fetchApiSendJson, shuffle } from '../../utils';
import { wsConnect, wsDisconnect } from '../websocket';

// export const createQuestionForm = () => async dispatch => {
//   try {
//     // dispatch(wsConnect());
//     dispatch(setLoaderAction('Загрузка формы...'));
//     dispatch(createNewQuestion());
//     dispatch(setLoaderAction('Загружено успешно...'));
//
//   } catch (error) {
//     dispatch(showPopUpAction('ERROR', error.message));
//   }
// };

export const fetchQuestions = selectedCategories => async dispatch => {
  try {
    dispatch(setLoaderAction('Извлечение категорий...'));
    dispatch({ type: 'CLEAR_QUESTIONS' });
    await Promise.all(
      selectedCategories.map(async ({ category }) => {
        const response = await fetchApi(`categories/${category}/questions`);
        const questions = await checkFetchError(response);
        dispatch({ type: 'QUESTIONS_FETCHED', questions });
      })
    );
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export const confirmQuestionAndContinue = (roomCode, question) => async dispatch => {
  try {
    dispatch(setLoaderAction('Загрузка...'));
    const response = await fetchApiSendJson(`rooms/${roomCode}/question`, 'PUT', { question });
    const { questionClosed, questionNo } = await checkFetchError(response);

    dispatch({ type: 'CONFIRM_QUESTION_SELECTED', question, questionClosed, questionNo });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export default produce((draft, action) => {
  switch (action.type) {
    case 'QUESTIONS_FETCHED':
      shuffle(action.questions);
      draft.questions = [...draft.questions, ...action.questions];
      return;
    case 'ITEM_LIST_CHANGED_QUESTIONS':
      draft.selectedQuestion = action.value;
      return;
    case 'CLEAR_QUESTIONS':
      draft.questions = [];
      return;
    case 'CONFIRM_QUESTION_SELECTED':
      draft.currentQuestion = action.question;
      draft.questionsAsked = [...draft.questionsAsked, action.question._id];
      draft.questionClosed = action.questionClosed;
      draft.question = action.questionNo;
      draft.selectedQuestion = null;
      return;
    case 'CREATE_QUESTION':
      draft.status = true;
      draft.isQuestionSaved = false;
      return;
    case 'QUESTION_SAVED':
      draft.status = false;
      draft.isQuestionSaved = true;
      return;
    default:
      return;
  }
});

