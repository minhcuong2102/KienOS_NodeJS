const { Sequelize, Op } = require('sequelize');
const db = require('../db/models');
// const { OpenAI } = require("openai");
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

async function getAllExercisesAsPromptString() {
    const exercises = await db.Exercise.findAll();
  
    return exercises.map(ex => {
      return `- ${ex.name}: ${ex.repetitions}, ${ex.duration}s, nghỉ ${ex.rest_period || 45}s`;
    }).join('\n');
}

module.exports = {
    getAllExercisesAsPromptString
}