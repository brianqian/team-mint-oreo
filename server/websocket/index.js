const uuidv4 = require('uuid/v4');
const socketio = require('socket.io');
const db = require('../controllers');
const onLogin = require('./login');
const onSend = require('./sendMsg');
const onFriendReq = require('./friendRequest');
const mailService = require('../services/mailService');

/* SOCKET METHODS */

// On Login---------------------------------------------

const addChatroom = async (socket, userId, chatId) => {
  await db.user.addChatById(userId, chatId);
  await db.chatroom.addUser(userId, chatId);
};

const acceptInvitation = async (socket, userId, friendId) => {
  await db.user.addFriend(userId, friendId);
};

const updateUserChatroom = async (userIds, chatId) => {
  try {
    const updatedUserInfos = await Promise.all(
      userIds.map(userId => {
        return db.user.addChatById(userId, chatId);
      })
    );
    console.log('Updated User List: ', updatedUserInfos);
  } catch (err) {
    throw new Error(500, 'update user chatroom', err);
  }
};

/* SOCKET HANLDER */

const handleSocket = server => {
  const io = socketio.listen(server);
  io.on('connection', socket => {
    console.log(`${socket.id} has connected to the site.`);

    socket.on('login', async ({ userId, chatId }) => {
      console.log('login ping');
      onLogin.registerSocketId(socket, userId);
      onLogin.joinChatrooms(socket, userId);
      onLogin.notifyFriends(socket, userId);
      //  addChatroom(socket, userId, chatId);
    });

    socket.on('sendMsg', async msgObject => {
      const translations = await onSend.translateMessage(msgObject);
      const outgoingMsg = { ...msgObject, translations, timestamp: Date.now() };
      const { _id } = await db.message.createMessage(outgoingMsg);
      onSend.sendMessage(io, { ...outgoingMsg, _id });
      db.chatroom.updateLastMessage();
    });

    // current user is sending the friend an invitation request
    socket.on('friendRequestSent', async ({ fromUser, toUser }) => {
      // await addFriend(socket, userId, friendEmail);
      try {
        const invExists = await db.invitation.invitationExists(fromUser, toUser);
        const alreadyFriends = await db.user.checkFriendship(fromUser, toUser);
        // const invExists = false;
        // const alreadyFriends = false;

        // check for friendship or existing invitation
        // If it does, we don't send notification mail in a first place
        if (invExists || alreadyFriends) throw new Error('Invitation / Friend already registered');

        const randomId = uuidv4();

        mailService.sendInvitationEmail(fromUser, toUser, randomId, (err, isSent) => {
          if (err) throw err;
          if (isSent) console.log('Email successfully sent');
        });

        const newInvitation = await db.invitation.createInvitation(fromUser, toUser, randomId);
        console.log(newInvitation, ' has been created');

        /* Maybe convert the userId into email? */
        /* Or we can possibly send the whole User query to fromUser & toUser
                that was returned from mongo */

        // This socket identifies from who, to who, and the identifier of invitation itself
        socket.to(toUser).emit('friendRequestReceived', {
          fromUser,
          toUser,
          invitation: newInvitation.id,
        });
      } catch (err) {
        // Error will occur if the user tries to add duplicate
        // invitation, or internal server error
        console.error(err);
      }
    });
    // socket.on('friendRequestReceived', () => {});

    socket.on('friendRequestAccepted', async ({ userId, friendId, invitationId }) => {
      try {
        await acceptInvitation(socket, userId, friendId);
        db.invitation.deleteInvitation(invitationId);

        // Automatically creates a chatroom, and assign users in there
        const newChatRoomId = await db.chatroom.createChatroom([userId, friendId]);
        console.log(newChatRoomId);
        await updateUserChatroom([userId, friendId], newChatRoomId);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('isTyping', (userId, chatId) => {
      socket.to(chatId).emit('isTyping', { userId });
    });
    socket.on('endTyping', (userId, chatId) => {
      socket.to(chatId).emit('endTyping', { userId });
    });

    socket.on('searching', () => {});

    socket.on('test', () => {
      console.log('Connected sockets');
    });
    socket.on('disconnect', reason => {
      console.log(`${socket.id} has left the site. ${reason}`);
      db.user.clearSocketId(socket.id);
    });

    socket.on('reconnecting', () => {
      console.log('reconnecting socket..');
    });
  });
};

module.exports = {
  listen: handleSocket,
};
