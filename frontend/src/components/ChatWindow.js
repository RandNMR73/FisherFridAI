import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';

const MessageBubble = ({ message }) => (
  <Box sx={{ display: 'flex', mb: 2, justifyContent: message.isUser ? 'flex-end' : 'flex-start' }}>
    {!message.isUser && (
      <Avatar sx={{ bgcolor: deepPurple[500], mr: 1 }}>AI</Avatar>
    )}
    <Paper
      elevation={1}
      sx={{
        p: 2,
        maxWidth: '70%',
        bgcolor: message.isUser ? 'primary.light' : 'background.default',
        borderRadius: 4,
      }}
     >
      <Typography variant="body1">{message.text}</Typography>
      <Typography variant="caption" sx={{ display: 'block', mt: 1,textAlign: 'right' }}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </Typography>
    </Paper>
    {message.isUser && (
      <Avatar sx={{ bgcolor: deepOrange[500], ml: 1 }}>U</Avatar>
    )}
</Box> 
);

const ChatWindow = ({ messages }) => (
  <Box sx={{
    flexGrow: 1,
    overflow: 'auto',
    p: 2,
    display: 'flex',
    flexDirection: 'column-reverse', // This will make the newest messages appear at the bottom
    mt: 3 // Add some margin to account for the arrow from the input area
  }}>
    {messages.length === 0 ? (
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 2 }}>
        Start by entering your goal above.
      </Typography> 
    ) : (  
      messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      )) 
    )}
  </Box> 
);

export default ChatWindow;
 