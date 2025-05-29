const express = require('express');
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const { getAllChats,
  getAllChatsOfCustomerId,
  getAllChatsOfCoachId,
  getChatMenuOfCustomerId,
  getChatMenuOfCoachId,
  sendMessage,

  getAllChatsOfCustomerIdAndCoachId,
  getAllCoachProfiles,
  getAllCustomerProfiles,
  getAllCustomerProfilesInContractWithCoachId,
  sendToGPT,
  sendToGemini,
  sendMessage1,

  } = require('../service/chat.service');
const { successResponse } = require('../util/response.util');

const router = express.Router();


router.get('/', (req, res, next) => {
  return getAllChats()
    .then(t => {successResponse(res, t)})
    .catch(next);
});
router.get('/getChatMenuOfCoachId/:id', async (req, res, next) => {
  try {
    const result = await getChatMenuOfCoachId(req.params.id);
    successResponse(res, result);
  } catch (error) {
    console.error('❌ Lỗi tại getChatMenuOfCoachId:', error); // Log chi tiết
    res.status(500).json({ error:  errorResponse(res, error) || 'Internal Server Error' }); // Trả lỗi rõ ràng
  }
});

// router.get('/getAllChatsOfCustomerId/:id', (req, res, next) => {
//   return getAllChatsOfCustomerId(req.params.id)
//     .then(t => {successResponse(res, t)})
//     .catch(error => {
//       console.error('Lỗi khi gọi getChatMenuOfCoachId:', error);
//       next(error);
//     });
// });

router.get('/getAllChatsOfCoachId/:id', (req, res, next) => {
  return getAllChatsOfCoachId(req.params.id)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.get('/getChatMenuOfCustomerId/:id', (req, res, next) => {
  return getChatMenuOfCustomerId(req.params.id)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.get('/getChatMenuOfCoachId/:id', (req, res, next) => {
  return getChatMenuOfCoachId(req.params.id)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.post('/sendMessage', (req, res, next) => {
  return sendMessage(req)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

//getAllChatsOfCustomerIdAndCoachId
router.get('/getAllChatsOfCustomerIdAndCoachId', (req, res, next) => {
  const { customerId, coachId, sendFrom } = req.query;
  return getAllChatsOfCustomerIdAndCoachId(customerId, coachId, sendFrom)
    .then(t => { successResponse(res, t) })
    .catch(next);
});

router.get('/getAllCoachProfiles', (req, res, next) => {
  return getAllCoachProfiles()
    .then(t => { successResponse(res, t) })
    .catch(next);
});

router.get('/getAllCustomerProfiles', (req, res, next) => {
  return getAllCustomerProfiles()
    .then(t => { successResponse(res, t) })
    .catch(next);
});

router.get('/getAllCustomerProfilesInContractWithCoachId/:id', (req, res, next) => {
  return getAllCustomerProfilesInContractWithCoachId(req?.params?.id)
    .then(t => { successResponse(res, t) })
    .catch(next);
});

router.post("/askGPT", (req, res, next) => {
  const { message } = req.body;
  return sendToGPT(message)
    .then(reply => successResponse(res, { reply }))
    .catch(next);
});

router.post('/sendMessageGemini', async (req, res, next) => {
  try {
    const { userMessage, aiMessage } = await sendMessage1(req);
    res.json({
      success: true,
      data: {
        user: userMessage,
        ai: aiMessage
      }
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

function initChatController(app) {
  const subRoute = process.env.SUB_ROUTE || "";
  app.use(subRoute+"/chat", router);
}

module.exports = initChatController;
