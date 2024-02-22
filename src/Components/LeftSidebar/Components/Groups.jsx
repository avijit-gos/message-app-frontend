/** @format */

import { Box, Button } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SkeletonLoader from "../../Loader/SkeletonLoader/SkeletonLoader";
import ChatCard from "../../ChatCard/ChatCard";

const Groups = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(10);
  const [groups, setGroups] = useState([]);

  const handleChangeSortTab = (data) => {
    setLoading(true);
    setActive(data);
  };
  useEffect(() => {
    setActive(user.hobbies[0]);
  }, []);

  useEffect(() => {
    if (page === 1) {
      setLoading(true);
    }
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/get-groups?sortType=${active}&page=${page}limit=${limit}`,
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
  }, [page, active]);

  return (
    <Box className='channel_container'>
      {/* Channel sort section */}
      <Box className='channel_sorting_container'>
        {user.hobbies.map((data) => (
          <Button
            onClick={() => handleChangeSortTab(data)}
            key={data}
            className={
              data === active ? "active_sort_btn sort_btn" : "sort_btn"
            }>
            {data}
          </Button>
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
