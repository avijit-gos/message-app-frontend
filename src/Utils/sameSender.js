/** @format */

export function isSameSender(messages, index, message) {
  return index > 0
    ? messages[index - 1].user._id === message.user._id
    : false;
}
