/** @format */

import { Box, Button } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SkeletonLoader from "../../../../../../Components/Loader/SkeletonLoader/SkeletonLoader";
import ChatCard from "../../../../../../Components/ChatCard/ChatCard";
import { MdClose } from "react-icons/md";
import AuthButton from "../../../../../../Components/ButtonComp/AuthButton";

const Groups = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(10);
  const [groups, setGroups] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);

  const handleChangeSortTab = (data) => {
    setLoading(true);
    setActive(data);
    setGroups([]);
  };

  useEffect(() => {
    if (!active.trim()) {
      if (page === 1) {
        setLoading(true);
      }
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/chat/my-groups?page=${page}&limit=${limit}`,
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      };

      axios
        .request(config)
        .then((response) => {
          setCount(response.data);
          if (page === 1) {
            setGroups(response.data);
          } else {
            setGroups((prev) => [...prev, ...response.data]);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      console.log("Came with sort type");
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/chat/sorted-groups?page=${page}&limit=${limit}&sorttype=${active}`,
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      };

      axios
        .request(config)
        .then((response) => {
          setCount(response.data);
          if (page === 1) {
            setGroups(response.data);
          } else {
            setGroups((prev) => [...prev, ...response.data]);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [page, active]);

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
        <Box className='chat_cards_section'>
          <SkeletonLoader />
        </Box>
      ) : (
        <>
          {(groups || []).length > 0 ? (
            <>
              {groups.map((chat) => (
                <ChatCard key={chat._id} chat={chat} />
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

export default Groups;
