/** @format */

export const getChatName = (users, profile) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i]._id !== profile._id) {
      return users[i];
    }
  }
};
