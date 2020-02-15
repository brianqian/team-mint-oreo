import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid } from '@material-ui/core';
import { store as directoryStore } from '../../store/directory/directory.provider';
import ChatHeader from '../chat-header/chat-header.component';
import MessageField from '../message-field/message-field.component';
import ChatMessages from '../chat-messages/chat-messages.component';

const ChatFrame = ({ socket }) => {
  const {
    state: { currentlyActive: chatId },
  } = useContext(directoryStore);

  const [messages, setMessage] = useState([]);

  useEffect(() => {
    // check front end cache for stored conversation
    // if not cached, get messages from db
    socket.on('receiveMsg', msg => {
      console.log('msg received!', msg);
    });

    console.log('chatid is', chatId);
  }, [chatId]);

  return (
    <Box height="100vh" overflow="hidden">
      <Grid style={{ height: '100%' }} direction="column" spacing={2}>
        <Grid item>
          <ChatHeader />
        </Grid>
        <Grid item style={{ height: '100%' }}>
          <ChatMessages messages={messages} />
          <MessageField emit={socket.emit} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatFrame;
