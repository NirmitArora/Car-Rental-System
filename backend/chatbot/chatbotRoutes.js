// routes/chatbotRoutes.js
const express = require('express');
const { getRelatedQuestions, getAnswer } = require('../chatbot/chatbotController');

const router = express.Router();

// Route to get related questions
router.get('/related-questions', getRelatedQuestions);

// Route to get an answer to a specific question
router.get('/answer', getAnswer);

module.exports = router;
