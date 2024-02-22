/** @format */

import { Box, Button } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import SkeletonLoader from "../../Loader/SkeletonLoader/SkeletonLoader";
import axios from "axios";
import ChannelCard from "../../ChannelCard/ChannelCard";
import AuthButton from "../../ButtonComp/AuthButton";
import { MdClose } from "react-icons/md";

const Channels = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(10);
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [channels, setChannels] = useState([]);

  const handleChangeSortTab = (data) => {
    setLoading(true);
    setActive(data);
  };

  useEffect(() => {
    if (active.trim()) {
      if (page === 1) {
        setLoading(true);
      }
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/channel/all?page=${page}&limit=${limit}&sortType=${active}`,
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      };

      axios
        .request(config)
        .then((response) => {
          setCount(response.data.length);
          if (page === 1) {
            setChannels(response.data);
          } else {
            setChannels((prev) => [...prev, ...response.data]);
          }
          setLoading(false);
          setBtnDisable(false);
          setBtnLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (page === 1) {
        setLoading(true);
      }
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/channel/?page=${page}&limit=${limit}`,
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      };

      axios
        .request(config)
        .then((response) => {
          setCount(response.data.length);
          if (page === 1) {
            setChannels(response.data);
          } else {
            setChannels((prev) => [...prev, ...response.data]);
          }
          setLoading(false);
          setBtnDisable(false);
          setBtnLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [page, limit, active]);

  const incrementPage = () => {
    setBtnDisable(true);
    setBtnLoading(true);
    setPage((prev) => prev + 1);
  };

  return (
    <Box className='channel_container'>
      {/* Channel sort section */}
      <Box className='channel_sorting_container'>
        {user.hobbies.map((data) => (
          <>
            {active === data ? (
              <Button
                onClick={() => setActive("")}
                key={data}
                className={
                  data === active ? "active_sort_btn sort_btn" : "sort_btn"
                }>
                {data}
                <MdClose />
              </Button>
            ) : (
              <Button
                onClick={() => handleChangeSortTab(data)}
                key={data}
                className={
                  data === active ? "active_sort_btn sort_btn" : "sort_btn"
                }>
                {data}
              </Button>
            )}
          </>
        ))}
      </Box>
      {/* Channel rendering section */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <>
          {(channels || []).length > 0 ? (
            <>
              {channels.map((data) => (
                <ChannelCard key={data._id} channel={data} />
              ))}
              {count === limit && (
                <Box className='load_more_section'>
                  <AuthButton
                    loading={btnLoading}
                    disable={btnDisable}
                    className={"load_more_btn"}
                    disableClassName={"load_more_btn"}
                    text='Load more'
                    clickHandler={incrementPage}
                  />
                </Box>
              )}
            </>
          ) : (
            <Box className='empty_chat_section'>No data found</Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Channels;
