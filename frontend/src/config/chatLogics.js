export const getSender = (loggedUser, users) => {
  if(!loggedUser || !users) return false;
  if(users.length < 2) return false;
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  if(!loggedUser || !users) return 0;
  if(users.length < 2) return 0;
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

// To display Toolpit
export const isMessageByReceiver = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

// To display Toolpit
export const isLastMessageIsByReceiver = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

// To separate messages
export const marginForMessage = (messages, m, i, userId) => {
  if (m.sender._id === userId)
    return 33;
  else
    return 0;
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 36;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";

};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};