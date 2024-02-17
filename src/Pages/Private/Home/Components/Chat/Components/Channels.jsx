/** @format */

import { Box, Button } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const Channels = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState();

  useEffect(() => {
    setActive(user.hobbies[0]);
  }, []);

  const handleChangeSortTab = (data) => {
    setLoading(true);
    setActive(data);
  };
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
    </Box>
  );
};

export default Channels;
