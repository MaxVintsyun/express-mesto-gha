const Card = require('../models/card');

function throwCardError(err, res) {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  if (err.name === 'CastError') {
    return res.status(404).send({ message: 'Карточка не найдена' });
  }
  return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => throwCardError(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => throwCardError(err, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => throwCardError(err, res));
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card !== null) {
        return res.send({ data: card });
      }
      return res.status(404).send({ message: 'Карточка не найдена' });
    })
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные' }));
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => throwCardError(err, res));
};
