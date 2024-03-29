import produce from 'immer';

import { wsConnect, wsDisconnect } from '../websocket';
import { setLoaderAction, stopLoaderAction } from '../loader';
import { showPopUpAction } from '../pop-up';
import { checkFetchError, fetchApi, fetchApiSendJson } from '../../utils';

export const setRoom = (roomCode) => ({ type: 'SET_ROOM', roomCode });

export const clearRoomCode = () => ({ type: 'CLEAR_ROOM_CODE' });

export const createRoom = () => async dispatch => {
  try {
    dispatch(setLoaderAction('Создание комнаты...'));
    dispatch(clearQuizzMaster());

    const response = await fetchApiSendJson(`rooms`, 'POST', { status: "ok" });
    const { roomCode } = await checkFetchError(response);

    dispatch(wsConnect());
    dispatch(setRoom(roomCode));
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export const fetchRoomState = roomCode => async dispatch => {
  try {
    const response = await fetchApi(`rooms/${roomCode}`);
    const room = await checkFetchError(response);

    dispatch({ type: 'FETCHED_ROOM_INFO', room });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  }
};

export const closeRoomQuestion = roomCode => async dispatch => {
  try {
    dispatch(setLoaderAction('Закрытие вопроса...'));

    const response = await fetchApiSendJson(`rooms/${roomCode}`, 'PATCH', {
      questionClosed: true,
    });
    const { questionClosed } = await checkFetchError(response);

    dispatch({ type: 'ROOM_QUESTION_CLOSE', questionClosed });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export const questionCompleted = roomCode => async dispatch => {
  try {
    dispatch(setLoaderAction('Loading...'));
    const response = await fetchApiSendJson(`rooms/${roomCode}`, 'PATCH', {
      questionCompleted: true,
    });
    const { roundStarted, questionNo, currentQuestion, questionClosed } = await checkFetchError(
      response
    );

    dispatch({
      type: 'QUESTION_COMPLETED',
      roundStarted,
      questionNo,
      currentQuestion,
      questionClosed,
    });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export const clearQuizzMaster = () => ({ type: 'CLEAR_QUIZZ_MASTER' });

export const endQuizz = roomCode => async dispatch => {
  try {
    dispatch(setLoaderAction('Загрузка...'));
    const response = await fetchApi(`rooms/${roomCode}`, 'DELETE');
    await checkFetchError(response);

    dispatch(clearQuizzMaster());
    dispatch(wsDisconnect());
    dispatch(showPopUpAction('Викторина окончена.', 'Победила дружба.'));
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export default produce((draft, action) => {
  switch (action.type) {
    case 'SET_ROOM':
      draft.roomCode = action.roomCode;
      return;
    case 'CLEAR_ROOM_CODE':
      draft.roomCode = null;
      return;
    case 'FETCHED_ROOM_INFO':
      draft.round = action.room.round;
      draft.currentQuestion = action.room.currentQuestion;
      draft.round = action.room.round;
      draft.questionClosed = action.room.questionClosed;
      draft.approvedTeamApplications = action.room.teams;
      return;
    case 'ROOM_QUESTION_CLOSE':
      draft.questionClosed = action.questionClosed;
      return;
    case 'QUESTION_COMPLETED':
      draft.currentQuestion = action.currentQuestion;
      draft.questionClosed = action.questionClosed;
      if (!action.roundStarted) {
        draft.roundStarted = action.roundStarted;
        draft.question = action.questionNo;
        draft.categories = [];
        draft.selectedCategories = [];
        draft.selectedCategory = null;
      }
      return;
    case 'CLEAR_QUIZZ_MASTER':
      draft.roomCode = null;
      draft.selectedTeamApplication = null;
      draft.teamApplications = [];
      draft.approvedTeamApplications = [];
      draft.roomClosed = false;
      draft.round = 0;
      draft.roundStarted = false;
      draft.selectedCategory = null;
      draft.categories = [];
      draft.selectedCategories = [];
      draft.question = 0;
      draft.questions = [];
      draft.questionsAsked = [];
      draft.currentQuestion = null;
      draft.questionClosed = true;
      draft.selectedQuestion = null;
      draft.approvingATeamGuess = false;
      return;
    default:
      return;
  }
});
