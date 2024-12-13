// controllers/chatbotController.js
const fs = require('fs');

// Path to the knowledge base JSON file
const knowledgeBasePath = './chatbot/knowledgebase.json';
let knowledgeBase = {};

// Read knowledge base from file
fs.readFile(knowledgeBasePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error loading knowledge base:', err);
  } else {
    knowledgeBase = JSON.parse(data);
    console.log('Knowledge base loaded successfully.');
  }
});

// Function to get related questions
const getRelatedQuestions = (req, res) => {
  const keyword = req.query.keyword?.toLowerCase();
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }
  const relatedQuestions = Object.keys(knowledgeBase).filter((question) =>
    question.toLowerCase().includes(keyword)
  );
  res.json(relatedQuestions);
};

// Function to get an answer to a specific question
const getAnswer = (req, res) => {
  const question = req.query.question;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }
  const answer = knowledgeBase[question] || "Sorry, I don't have an answer for that.";
  res.json({ answer });
};

module.exports = { getRelatedQuestions, getAnswer };
