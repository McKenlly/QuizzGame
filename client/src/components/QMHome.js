import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-grid-system';
import { createRoom } from '../reducers/qm/room';
import { createQuestionForm } from '../reducers/team-app';

import Logo from './Logo';
import Button from './Button';
import { CenterLoader } from './Loader';
// import { setLoaderAction } from '../reducers/loader';

const QMHome = () => {
  const isLoading = useSelector(state => state.loader.active);
  const websocketConnected = useSelector(state => state.websocket.connected);
  const questionMaking = useSelector(state => state.quizzMasterApp.status);
  // const isQuestionSaved = useSelector(state => state.quizzMasterApp.status);

  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(createRoom());
  };
  if (questionMaking /*&& websocketConnected*/) {
    return <Redirect to="/master/createquestion" />;
  } else if (websocketConnected) {
    return <Redirect to="/master/teams" />;
  } else if (isLoading) {
    return <CenterLoader />;
  }
  return (
    <Container className="full-screen center">
      <Row className="focus-center">
        <Col>
          <Logo />
          <h2>Захости слот для команды или создай вопрос</h2>
          <Button
            onClick={() => handleClick()}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginRight: '16px' }}
          >
            Хост!
          </Button>
          <Button
            onClick={() => dispatch(createQuestionForm())}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginRight: '16px' }}
          >
            Создать вопрос
          </Button>

        </Col>
      </Row>
    </Container>
  );
};

export default QMHome;
