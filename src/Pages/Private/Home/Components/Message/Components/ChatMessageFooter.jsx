/** @format */

import { Box, Button, Img, Input } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { GlobalContext } from "../../../../../../Context/Context";
import InputComp from "../../../../../../Components/InputComp/InputComp";
import { GrGallery } from "react-icons/gr";
import { BsEmojiLaughing, BsSendFill } from "react-icons/bs";
import AuthButton from "../../../../../../Components/ButtonComp/AuthButton";
import { MdOutlineClose } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

const ChatMessageFooter = () => {
  const { selectChatId, selectChat } = GlobalContext();
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [disable, setdisable] = useState(true);
  const [openEmoji, setOpenEmoji] = useState(false);
  const ref = useRef(null);

  // Handle image change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    if (!message.trim() && !prevImage.trim()) {
      setdisable(true);
    } else {
      setdisable(false);
    }
  }, [message, prevImage]);

  // Close preview image
  const closePreviewImage = () => {
    setPrevImage("");
    setImage("");
  };

  // Handle send message
  const handleSendMessage = () => {};

  // Handle adding emoji in input
  const onEmojiClick = (event, emojiObject) => {
    // console.log(event.emoji);
    setMessage((prev) => prev + event.emoji);
  };

  // close the div if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenEmoji(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <Box className='chat_message_footer_section'>
      {/* Preview image section */}
      {prevImage && (
        <Box className='message_preview_image_section'>
          <Img src={prevImage} className='message_preview_image' />
          <Button className='close_btn' onClick={closePreviewImage}>
            <MdOutlineClose />
          </Button>
        </Box>
      )}

      {/* Emoji section */}
      {openEmoji && (
        <Box className='emoji_container' ref={ref}>
          <EmojiPicker
            className='emoji_section'
            height={400}
            width={300}
            onEmojiClick={onEmojiClick}
          />
        </Box>
      )}

      <InputComp
        type='text'
        placeholder='Enter message'
        className='message_input'
        value={message}
        handleChange={(e) => setMessage(e.target.value.slice(0, 400))}
      />
      <Box className='chat_message_buttons_section'>
        <label htmlFor='image_file' className='image_label'>
          <GrGallery className='message_footer_icon' />
          <Input
            type='file'
            id='image_file'
            className='file_input'
            onChange={(e) => handleImageChange(e)}
            accept='image/*'
          />
        </label>

        <Button
          className='message_footer_btn'
          onClick={() => setOpenEmoji(true)}>
          <BsEmojiLaughing className='message_footer_icon' />
        </Button>

        <AuthButton
          loading={loading}
          disable={disable}
          className='message_send_btn'
          disableClassName='disable_message_send_btn'
          clickHandler={handleSendMessage}
          text={<BsSendFill />}
        />
      </Box>
    </Box>
  );
};

export default ChatMessageFooter;
