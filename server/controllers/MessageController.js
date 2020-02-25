const mongoose = require('mongoose');
const ValidationError = mongoose.Error.ValidationError;
const Message = require('../models/Message');
const Error = require('../utils/Error');

const createMessage = async msg => {
  const { userId, chatId, ...rest } = msg;
  const { ObjectId } = mongoose.Types;
  try {
    const newMessage = await Message.create({
      userId: ObjectId(userId),
      chatId: ObjectId(chatId),
      ...rest,
    });
    console.log('New message created: ', newMessage);
    return newMessage;
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new Error(400, 'createMessage:' + err.message, err);
    }
    throw new Error(500, 'Internal Server Error at createMessage()', err);
  }
};

const getAllByChatId = async (chatId, limit = 50, skip = 0) => {
  try {
    console.log('getchatbyid');
    const messages = await Message.find({ chatId }, null, { skip, limit }).sort('-createdAt');
    return messages;
  } catch (err) {
    throw new Error(500, 'Get Message - ID', err);
  }
};

const getUnreadCount = async (chatId, latestTimestamp) => {
  if (!latestTimestamp) return 0;
  const formattedDate = new Date(latestTimestamp);
  console.log('formattedDate', formattedDate);
  const count = await Message.countDocuments({ chatId, createdAt: { $gte: formattedDate } });
  if (count) {
    console.log('COUNT OF UNREADS', count);
    console.log('latest timestamp', latestTimestamp);
    console.log('formattedDate', formattedDate);
  }
  return count;
};

module.exports = {
  createMessage,
  getAllByChatId,
  getUnreadCount,
};
