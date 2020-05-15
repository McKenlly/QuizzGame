const sockets = require('../wss-clients');

const sessionHasWSConnect = errorMsg => (req, res, next) => {
  if (sockets.has(req.sessionID)) {
    return res.status(400).json({
      message: errorMsg,
    });
  }
  next();
};

const hasNotJoinedOrHosted = sessionHasWSConnect(
  'Вы уже ведущий / участник в комнате. Пожалуйста, закройте сеанс, чтобы создать новую комнату'
);

module.exports = {
  sessionHasWSConnect,
  hasNotJoinedOrHosted,
};
