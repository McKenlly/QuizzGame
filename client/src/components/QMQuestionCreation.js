import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Button from './Button';
import Loader from './Loader';
import Input from './Input';
import { submitQuestion } from '../reducers/team-app';
import { setLoaderAction } from '../reducers/loader';

const QMQuestionCreation = () => {
  const dispatch = useDispatch();
  const question = useSelector(state => state.teamApp.newquestion.value);
  const questionValid = useSelector(state => state.teamApp.newquestion.valid);
  const category = useSelector(state => state.teamApp.category.value);
  const categoryValid = useSelector(state => state.teamApp.category.valid);
  const answer = useSelector(state => state.teamApp.answer.value);
  const answerValid = useSelector(state => state.teamApp.answer.valid);
  const isQuestionSaved = useSelector(state => state.teamApp.isQuestionSaved);

  const handleClick = () => {
    dispatch(submitQuestion(category, question, answer));
  };


  if (isQuestionSaved) {
    return <Redirect to="/master/" />;
  }

  return (
    <>
      <Input
        reducer="teamApp"
        item="category"
        labelText="Категория"
        placeholder="Название категории"
        uppercase
        maxLength="32"
        showCounter
      />
      <Input
        reducer="teamApp"
        item="newquestion"
        labelText="Вопрос"
        placeholder="Введите ваш вопрос"
        uppercase
        maxLength="200"
        showCounter

      />
      <Input
        reducer="teamApp"
        item="answer"
        labelText="Ответ"
        placeholder="Введите ответ"
        maxLength="50"
        showCounter
      />
      <Button onClick={handleClick} disabled={!categoryValid || !questionValid || !answerValid} >
        Сохранить!
      </Button>
    </>
  );
};

export default QMQuestionCreation;
