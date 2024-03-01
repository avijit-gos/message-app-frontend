/** @format */

import CryptoJS from "crypto-js";

export const handleDecrypt = () => {
  const { encryptedMessage } = this.state;
  const key = process.env.REACT_APP_CRYPTO_KEY; // Replace with your secret key
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
};
