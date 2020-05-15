const mongoose = require('mongoose');

const Question = mongoose.model('Question');
const { readFileP } = require('./utils');

const seedQuestion = async (...languages) => {
  await Question.deleteMany();

  const questions = [];

  for (const language of languages) {
    // console.log(path.relative(process.cwd(), someFilePath))
    const languageQuestions = JSON.parse(await readFileP(`../../../data/data_question.json`));
    questions.push(...languageQuestions.map(q => ({ ...q, language })));
  }

  await Question.insertMany(questions);
};

module.exports = async () => {
  const supportedLanguages = ['en', 'nl'];

  await seedQuestion(...supportedLanguages);
};
