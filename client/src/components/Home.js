import React from 'react';
import { Container, Row, Col, Hidden } from 'react-grid-system';
import { Link } from 'react-router-dom';

import Logo from './Logo';
import Button from './Button';

const Card = ({ title, subtitle, link, button }) => (
  <div className="card">
    <h2>{title}</h2>
    <h3>{subtitle}</h3>
    <Link to={link}>
      <Button>{button}</Button>
    </Link>
  </div>
);

const Home = () => {
  return (
    <Container className="home-page top-anxiety">
      <Logo center />
      <Row>
        <Hidden xs>
          <Col lg={4}>
            <Card
              title="Ведущий"
              subtitle="Стань ведущим викторины и создай хост для игроков"
              link="/master"
              button="Начать!"
            />
          </Col>
        </Hidden>
        <Col lg={4}>
          <Card
            title="Команда"
            subtitle="Присоединись к команде. Здесь ждут сильнейших!"
            link="/team"
            button="Присоединиться!"
          />
        </Col>
        <Hidden xs>
          <Col lg={4}>
            <Card
              title="Доска почета"
              subtitle="Посмотри рейтинг участников и свой конечно же!"
              link="/scoreboard"
              button="Посмотреть!"
            />
          </Col>
        </Hidden>
      </Row>
    </Container>
  );
};

export default Home;
