const { sendToGeminiWithHistory } = require('../service/chat.service');
const db = require('../db/models');
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Lắng nghe tham gia phòng chat
    socket.on('joinRoom', async ({ coachId, customerId }) => {
      const room = `chat-${coachId}-${customerId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
      try {
        // 🔁 Lấy lịch sử tin nhắn từ DB (sắp xếp theo thời gian gửi)
        const history = await db.Message.findAll({
          where: {
            coach_id_id: coachId,
            customer_id_id: customerId
          },
          order: [['sent_at', 'ASC']]
        });
    
        // 🔁 Gửi về cho riêng socket vừa join
        // console.log("Type of history:", history); // true mới đúng
        socket.emit('chatHistory', history);
      } catch (err) {
        console.error('Error fetching history:', err);
        socket.emit('errorMessage', 'Không thể tải lịch sử tin nhắn');
      }
    });

    // Nhận tin nhắn từ client
    socket.on('sendMessage', async (data) => {
      try {
        const {
          content,
          sent_at = new Date(),
          is_read = false,
          is_ai = false,
          extra_data = { send_by: 'customer' },
          coach_id_id,
          customer_id_id,
        } = data;

        if (!content || !coach_id_id || !customer_id_id) {
          return socket.emit('errorMessage', 'Thiếu content, coach_id_id hoặc customer_id_id');
        }

        // 1. Lưu tin nhắn của người dùng vào DB
        const message = await db.Message.create({
          content,
          sent_at,
          is_read,
          is_ai,
          extra_data,
          coach_id_id,
          customer_id_id,
        });
        
        const room = `chat-${coach_id_id}-${customer_id_id}`;
        io.to(room).emit('newMessage', message); // 2. Gửi lại cho các client trong phòng
        console.log("CoachID: " + coach_id_id);
        console.log("CustomerID: " + customer_id_id);
        // 3. Nếu là user gửi (is_ai = false) thì gọi Gemini phản hồi
        if (!is_ai && coach_id_id == 11) {
          const aiMessage = await sendToGeminiWithHistory(content, coach_id_id, customer_id_id);
          if (aiMessage) {
            const aiSaved = await db.Message.create({
              content: aiMessage,
              sent_at: new Date(),
              is_read: false,
              is_ai: true,
              extra_data: { send_by: 'coach' },
              coach_id_id,
              customer_id_id,
            });

            io.to(room).emit('newMessage', aiSaved); // gửi lại AI message
          }
        }
      } catch (err) {
        console.error('Socket Error:', err);
        socket.emit('errorMessage', 'Có lỗi xảy ra khi gửi tin nhắn');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
