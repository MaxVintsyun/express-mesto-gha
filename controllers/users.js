const User = require('../models/user');

function throwUserError(err, res) {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  if (err.name === 'CastError') {
    return res.status(404).send({ message: 'Пользователь не найден' });
  }
  return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => throwUserError(err, res));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user !== null) {
        return res.send({ data: user });
      }
      return res.status(404).send({ message: 'Пользователь не найден' });
    })
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => throwUserError(err, res));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => throwUserError(err, res));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => throwUserError(err, res));
};
