import React, { useState } from 'react';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  const handleInput = async (e) => {
    const userInput = e.target.value.toLowerCase();
    setInput(userInput);

    if (!userInput.trim()) {
      setSuggestedQuestions([]); // Clear suggestions if input is empty
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/chatbot/related-questions?keyword=${encodeURIComponent(userInput)}`
      );
      const data = await response.json();
      setSuggestedQuestions(Array.isArray(data) ? data : []); // Ensure suggestions are an array
    } catch (error) {
      console.error('Error fetching related questions:', error);
      setSuggestedQuestions([]); // Fallback to an empty array on error
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);

    try {
      const response = await fetch(
        `http://localhost:3000/api/chatbot/answer?question=${encodeURIComponent(input)}`
      );
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.answer, sender: 'bot' }]);
    } catch (error) {
      console.error('Error fetching the answer:', error);
      setMessages((prev) => [...prev, { text: 'Sorry, something went wrong!', sender: 'bot' }]);
    }

    setInput('');
    setSuggestedQuestions([]); // Clear suggestions after sending
  };

  const handleSuggestedQuestionClick = async (question) => {
    setInput(question);
    setMessages((prev) => [...prev, { text: question, sender: 'user' }]);

    try {
      const response = await fetch(
        `http://localhost:3000/api/chatbot/answer?question=${encodeURIComponent(question)}`
      );
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.answer, sender: 'bot' }]);
    } catch (error) {
      console.error('Error fetching the answer:', error);
      setMessages((prev) => [...prev, { text: 'Sorry, something went wrong!', sender: 'bot' }]);
    }
    setInput('');
    setSuggestedQuestions([]); // Clear suggestions after selection
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">Car Rental Chatbot</div>
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div className="options-container">
          {(Array.isArray(suggestedQuestions) ? suggestedQuestions : []).map((question, index) => (
            <button
              key={index}
              className="question-btn"
              onClick={() => handleSuggestedQuestionClick(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="Type your question..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
