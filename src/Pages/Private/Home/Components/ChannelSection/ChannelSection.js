/** @format */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { GlobalContext } from "../../../../../Context/Context";
import "./channelSection.css";
import { Box } from "@chakra-ui/react";
import CircleLoader from "../../../../../Components/Loader/CircleLoader/CircleLoader";
import ChannelHeader from "./Components/ChannelHeader";
import ChannelBody from "./Components/ChannelBody";
import ChannelFooter from "./Components/ChannelFooter";

const ChannelSection = () => {
  const { selectChannelId } = GlobalContext();
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    setLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/channel/${selectChannelId}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        setChannel(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectChannelId]);
  return (
    <Box className='channel_page_container'>
      {loading ? (
        <Box className='channel_loading_page'>
          <CircleLoader />
        </Box>
      ) : (
        <>
          {channel ? (
            <>
              <ChannelHeader channel={channel} />
              <ChannelBody channel={channel} />
              <ChannelFooter channel={channel} />
            </>
          ) : (
            <Box className='empty_channel_container'>No data found</Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ChannelSection;
