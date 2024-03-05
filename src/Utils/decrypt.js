/** @format */

import CryptoJS from "crypto-js";

export const handleDecrypt = (value) => {
  const key = process.env.REACT_APP_CRYPTO_KEY; // Replace with your secret key
  const bytes = CryptoJS.AES.decrypt(value, key);
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
};
