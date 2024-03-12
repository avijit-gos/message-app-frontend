/** @format */

import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import Timline from "../../../../Config/timeline.json";

const Timeline = ({ timelines }) => {
  console.log(Timline);
  const groupedData = timelines.reduce((result, item) => {
    const date = new Date(item.createdAt).toDateString();
    if (!result[date]) {
      result[date] = [];
    }
    result[date].push(item);
    return result;
  }, {});

  return (
    <Box className='timeline_card_container'>
      {/* Map over the keys of the grouped data object */}
      {Object.keys(groupedData).map((date) => (
        <Box className='timeline_card_section' key={date}>
          <Box className='main_marker'></Box>
          <Box className='date_section'>
            <Box className='timeline_icon_section'>
              <FaCaretDown className='timeline_icon' />
            </Box>
            <Box>
              <Box className='timeline_date'>{date}</Box>
              <Box>
                {groupedData[date].map((document) => (
                  <Box className='timeline_inner_card' key={document._id}>
                    <Box className='marker'></Box>
                    <p className='timeline_message_section'>
                      {document.cat === 1 ? (
                        <>Group has been created</>
                      ) : (
                        <>
                          {document.cat === 2 ? (
                            <>Group's profile image has been updated</>
                          ) : (
                            <>
                              {document.cat === 3 ? (
                                <>Group name has been changed</>
                              ) : (
                                <>
                                  {document.cat === 4 ? (
                                    <>Group bio has been changed</>
                                  ) : (
                                    <>
                                      {document.cat === 5 ? (
                                        <>
                                          <span className='timeline_username'>
                                            {document.user.name}
                                          </span>
                                          new member added.
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Timeline;
