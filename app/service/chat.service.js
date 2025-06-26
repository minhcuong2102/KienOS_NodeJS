const { Sequelize, Op } = require('sequelize');
const db = require('../db/models');
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const {
    getAllExercisesAsPromptString
} = require('../service/exercise.service');

async function getAllChats() {
    return await db.Message.findAll();
}

async function getAllChatsOfCustomerId(customerId) {
    return await db.Message.findAll({
        where: {
            customer_id_id: customerId
        }
    });
}

async function getAllChatsOfCoachId(coachId) {
    return await db.Message.findAll({
        where: {
            coach_id_id: coachId
        }
    });
}

// make a function that return message of customer by customer id but for rows with the same coach id, return only the row which has sent_at is the latest
async function getChatMenuOfCustomerId(customerId) {
    // Step 1: Query to find the latest messages for each coach
    const latestMessages = await db.sequelize.query(
        `
        SELECT *
        FROM message AS m1
        WHERE m1.customer_id_id = :customerId
          AND m1.sent_at = (
            SELECT MAX(m2.sent_at)
            FROM message AS m2
            WHERE m2.coach_id_id = m1.coach_id_id
              AND m2.customer_id_id = :customerId
          )
        ORDER BY m1.coach_id_id ASC
        `,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { customerId },
        }
    );

    // Step 2: Query to find the customer profile data
    const customerProfile = await db.CustomerProfile.findOne({
        where: { customer_id: customerId }
    });

    // Step 3: Query to find the user data
    const user = await db.User.findOne({
        where: { id: customerId }
    });

    // Step 4: Query to find the coach profile data
    const coachIds = latestMessages.map(message => message.coach_id_id);
    const coachProfiles = await db.CoachProfile.findAll({
        where: {
            coach_id: {
                [Sequelize.Op.in]: coachIds
            }
        }
    });

    // Step 5: Query to find the user data for each coach
    const coachUsers = await db.User.findAll({
        where: {
            id: {
                [Sequelize.Op.in]: coachIds
            }
        }
    });

    // Step 6: Merge the results
    const result = latestMessages.map(message => {
        const coachProfile = coachProfiles.find(profile => profile.coach_id === message.coach_id_id);
        const coachUser = coachUsers.find(user => user.id === message.coach_id_id);
        return {
            ...message,
            customer_data: {
                ...customerProfile ? customerProfile.get() : {},
                ...user ? user.get() : {}
            },
            coach_data: {
                ...coachProfile ? coachProfile.get() : {},
                ...coachUser ? coachUser.get() : {}
            }
        };
    });

    return result;
}

//make function getChatMenuOfCoachId base on the same logic as getChatMenuOfCustomerId
async function getChatMenuOfCoachId(coachId) {
    // Step 1: Query to find the latest messages for each customer
    const latestMessages = await db.sequelize.query(
        `
        SELECT *
        FROM message AS m1
        WHERE m1.coach_id_id = :coachId
          AND m1.sent_at = (
            SELECT MAX(m2.sent_at)
            FROM message AS m2
            WHERE m2.customer_id_id = m1.customer_id_id
              AND m2.coach_id_id = :coachId
          )
        ORDER BY m1.customer_id_id ASC
        `,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { coachId },
        }
    );

    // Step 2: Query to find the coach profile data
    const coachProfile = await db.CoachProfile.findOne({
        where: { coach_id: coachId }
    });

    // Step 3: Query to find the user data for the coach
    const coachUser = await db.User.findOne({
        where: { id: coachId }
    });

    // Step 4: Query to find the customer profile data
    const customerIds = latestMessages.map(message => message.customer_id_id);
    const customerProfiles = await db.CustomerProfile.findAll({
        where: {
            customer_id: {
                [Sequelize.Op.in]: customerIds
            }
        }
    });

    // Step 5: Query to find the user data for each customer
    const customerUsers = await db.User.findAll({
        where: {
            id: {
                [Sequelize.Op.in]: customerIds
            }
        }
    });

    // Step 6: Merge the results
    const result = latestMessages.map(message => {
        const customerProfile = customerProfiles.find(profile => profile.customer_id === message.customer_id_id);
        const customerUser = customerUsers.find(user => user.id === message.customer_id_id);

        return {
            ...message,
            customer_data: {
                ...customerProfile ? customerProfile.get() : {},
                ...customerUser ? customerUser.get() : {}
            },
            coach_data: {
                ...coachProfile ? coachProfile.get() : {},
                ...coachUser ? coachUser.get() : {}
            }
        };
    });

    return result;
}

async function getAllChatsOfCustomerIdAndCoachId(customerId, coachId, sendFrom) {
    const messages = await db.Message.findAll({
        where: {
            customer_id_id: customerId,
            coach_id_id: coachId
        },
        order: [['sent_at', 'DESC']]
    });

    // Iterate over the messages and update the is_read field based on the sendFrom parameter
    for (const message of messages) {
        if(message?.is_read) continue;
        const send_by = message?.extra_data?.send_by;

        if ((send_by === 'customer' && sendFrom === 'coach') || (send_by === 'coach' && sendFrom === 'customer')) {
            message.is_read = true;
            await message.save(); // Save the updated message
        }
    }

    return messages;
}
//make a function to send message with post request, the body include content, sent_at, is_read, is_ai, extra_data, coach_id_id, customer_id_id
async function sendMessage(req) {
    let { content, sent_at, is_read, is_ai, extra_data, coach_id_id, customer_id_id } = req.body;

    if(!content || !coach_id_id || !customer_id_id) {
        throw new Error('content, coach_id_id, customer_id_id are required');
    }

    if(!sent_at) sent_at = new Date();
    if (is_read === undefined) is_read = false;
    if(!is_ai) is_ai = false;
    
    //Dùng static, "customer" là tin nhắn gửi bởi customer, "coach" là ... bởi coach
    if(!extra_data) extra_data = {
        "send_by": "customer"
    };

    return await db.Message.create({
        content,
        sent_at,
        is_read,
        is_ai,
        extra_data,
        coach_id_id,
        customer_id_id
    });
}
async function sendMessage1(req) {
    const { content, coach_id_id, customer_id_id, userProfileId } = req.body;
  
    if (!content || !coach_id_id || !customer_id_id) {
      throw new Error('content, coach_id_id, customer_id_id are required');
    }
  
    const sent_at = new Date();
    const userMessage = await db.Message.create({
      content,
      sent_at,
      is_read: false,
      is_ai: false,
      extra_data: { send_by: "customer" },
      coach_id_id,
      customer_id_id
    });
  
    const aiReply = await sendToGeminiWithHistory(content, coach_id_id, customer_id_id, userProfileId);
  
    const aiMessage = await db.Message.create({
      content: aiReply,
      sent_at: new Date(),
      is_read: false,
      is_ai: true,
      extra_data: { send_by: "coach" },
      coach_id_id,
      customer_id_id
    });
  
    return { userMessage, aiMessage };
  }
  
//make function to return all coachProfile data and also include User data to it
async function getAllCoachProfiles() {
    return await db.CoachProfile.findAll({
        include: [
            {
                model: db.User,
                as: 'coach', // Alias for the association
                foreignKey: 'coach_id'
            }
        ]
    });
}

//make function to return all customerProfile data and also include User data to it
async function getAllCustomerProfiles() {
    return await db.CustomerProfile.findAll({
        include: [
            {
                model: db.User,
                as: 'customer', // Alias for the association
                foreignKey: 'customer_id'
            }
        ]
    });
}

async function getAllCustomerProfilesInContractWithCoachId(coachId) {
    // Step 1: Join the Contract table with the CoachProfile table to get the correct coach_id
    const contracts = await db.Contract.findAll({
        where: {
            is_purchased: true // Only get contracts that have is_purchased = true
        },
        include: [
            {
                model: db.CoachProfile,
                as: 'coach',
                where: {
                    coach_id: coachId
                },
                attributes: [] // We don't need any attributes from CoachProfile
            }
        ]
    });

    // Step 2: Filter out contracts where customer_id is null
    const customerProfileIds = contracts
        .filter(contract => contract.customer_id !== null)
        .map(contract => contract.customer_id);

    if (customerProfileIds.length === 0) {
        return []; // Return an empty array if there are no valid customer IDs
    }

    // Step 3: Query CustomerProfile with valid id values
    return await db.CustomerProfile.findAll({
        where: {
            id: {
                [Sequelize.Op.in]: customerProfileIds
            }
        },
        include: [
            {
                model: db.User,
                as: 'customer', // Alias for the association
                foreignKey: 'id'
            }
        ]
    });
}

async function sendToGPT(userMessage) {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // hoặc "gpt-4"
      messages: [
        { role: "system", content: "Bạn là một trợ lý thân thiện, chỉ trả lời các câu hỏi huấn luyện viên." },
        { role: "user", content: userMessage }
      ]
    });
  
    return response.choices[0].message.content;
  }

async function sendToGemini(messageText) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
      // Đúng format: chỉ truyền chuỗi
      const result = await model.generateContent(messageText);
      const response = result.response;
      const text = await response.text();
  
      return text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to get response from Gemini');
    }
  }

  async function getRecentMessages(coachId, customerId, limit = 10) {
    const messages = await db.Message.findAll({
      where: {
        coach_id_id: coachId,
        customer_id_id: customerId,
      },
      order: [['sent_at', 'DESC']],
      limit,
    });
  
    return messages.reverse(); // Đảo ngược để đúng thứ tự thời gian
  }
  async function getAllExercisesAsPromptString1() {
    const exercises = await db.Exercise.findAll();
  
    return exercises.map(ex => {
      return `- ${ex.name}: ${ex.repetitions}, ${ex.duration}s, nghỉ ${ex.rest_period || 45}s`;
    }).join('\n');
}
  async function sendToGeminiWithHistory(content, coachId, customerId, userProfileId) {
    const exercisePrompt = await getAllExercisesAsPromptString();
    const messages = await getRecentMessages(coachId, customerId, 20);
    // const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const history = messages.map(msg => ({
      role: msg.extra_data?.send_by === 'coach' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    const userProfile = await db.CustomerProfile.findOne({
        where: { id: userProfileId }
    });
    const firstUserIndex = history.findIndex(m => m.role === 'user');
    if (firstUserIndex > 0) {
      // Hoán đổi về đầu
      const firstUser = history.splice(firstUserIndex, 1)[0];
      history.unshift(firstUser);
    }
    
    // Thêm tin nhắn mới của user
    history.push({
      role: 'user',
      parts: [{ text: content }]
    });
  
    const chat = model.startChat({ history,
        systemInstruction: {
            parts: [
              {
                text: `Bạn là một huấn luyện viên thể hình chuyên nghiệp. Bạn sẽ sử dụng danh sách các bài tập dưới đây để tư vấn cá nhân hóa cho người dùng.
                Danh sách bài tập (có category chỉ định vùng tác động):
                ${exercisePrompt}
                Lấy thông tin cá nhân của khách hàng từ ${userProfile} để xác định sức khỏe.
                QUY TẮC:
                - Nếu người dùng muốn giảm cân, tập trung chọn bài giúp đốt mỡ toàn thân, cardio, và những bài đa nhóm cơ.
                - Nếu người dùng đưa ra chiều cao và cân nặng, ước tính chỉ số BMI để xác định thừa cân, bình thường hay gầy.
                - Lập kế hoạch lịch tập 5-6 buổi/tuần, nghỉ 1-2 buổi.
                - Mỗi buổi có thể tập trung 1-2 nhóm cơ hoặc toàn thân.
                - Chỉ chọn các bài tập có trong danh sách. Nếu cần, gợi ý kết hợp chúng lại. 
                - Tùy thuộc vào thể trạng và sức khỏe mà repetiton của bài tập sẽ tăng giảm cho phù hợp
                
                Trả lời rõ ràng, có ngày tập cụ thể nếu cần. Nếu người dùng hỏi sai chủ đề, từ chối nhẹ nhàng. 
                Nếu hỏi về đăng ký gói tập, hãy yêu cầu khách hàng vào trang đăng ký để làm thủ công.`,
              }
            ]
          }     
        });
    const result = await chat.sendMessage(content);
    const response = result.response.text();
    return response;
  }

module.exports = {
    getAllChats,
    getAllChatsOfCustomerId,
    getAllChatsOfCoachId,
    getChatMenuOfCustomerId,
    getChatMenuOfCoachId,
    sendMessage,
    sendMessage1,

    getAllChatsOfCustomerIdAndCoachId,
    getAllCoachProfiles,
    getAllCustomerProfiles,
    getAllCustomerProfilesInContractWithCoachId,
    sendToGPT,
    sendToGemini,
    getRecentMessages,
    sendToGeminiWithHistory
}
