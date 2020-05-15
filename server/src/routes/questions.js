const router = require('express').Router();
const mongoose = require('mongoose');
const Question = mongoose.model('Question');

const catchErrors = require('../middleware/catch-errors');
const { QM } = require('./roles');
const { hasNotJoinedOrHosted } = require('../middleware/socket');

//#region questions
router.post(
  '/new_question',
  hasNotJoinedOrHosted,
  catchErrors(async (req, res) => {
    const { question, answer, category } = req.body;
    // req.session.role = QM;
    console.log(question);
    console.log(answer);
    // console.log(body);

    const newlyCreatedQuestion = new Question({ question: question, answer: answer, category: category });

    await newlyCreatedQuestion.save();
    req.session.questionID = newlyCreatedQuestion._id;

    req.session.save(() => res.json({ questionID: newlyCreatedQuestion._id }));
  })
);


module.exports = router;
