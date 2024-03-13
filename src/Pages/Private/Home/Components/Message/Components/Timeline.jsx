/** @format */

import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { TbUsersGroup, TbUserCog, TbUserPlus } from "react-icons/tb";

const Timeline = ({ timelines }) => {
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
        <Box className='time_card_section' key={date}>
          <Box className='timeline_card'>
            <Box className='timeline_icon_section'>
              <FaRegClock className='timeline_icon' />
            </Box>
            <Box className='timeline_date'>{date}</Box>
          </Box>
          <Box className='marker'></Box>
          <Box className='timeline_message_section'>
            {groupedData[date].map((document) => (
              <Box className='timeline_inner_card' key={document._id}>
                <p className='timeline_message'>
                  {document.cat === 1 ? (
                    <>
                      {" "}
                      <span className='timeline_message_icon'>
                        <TbUsersGroup />
                      </span>
                      Group has been created
                    </>
                  ) : (
                    <>
                      {document.cat === 2 ? (
                        <>
                          {" "}
                          <span className='timeline_message_icon'>
                            <TbUserCog />
                          </span>
                          Group's profile image has been updated
                        </>
                      ) : (
                        <>
                          {document.cat === 3 ? (
                            <>
                              <span className='timeline_message_icon'>
                                <TbUserCog />
                              </span>
                              Group name has been changed
                            </>
                          ) : (
                            <>
                              {document.cat === 4 ? (
                                <>
                                  <span className='timeline_message_icon'>
                                    <TbUserCog />
                                  </span>
                                  Group bio has been changed
                                </>
                              ) : (
                                <>
                                  {document.cat === 5 ? (
                                    <>
                                      <span className='timeline_message_icon'>
                                        <TbUserPlus />
                                      </span>
                                      <span className='timeline_username'>
                                        {document.user.name}
                                      </span>
                                      new member added.
                                    </>
                                  ) : (
                                    <>
                                      {document.cat === 6 ? (
                                        <>
                                          <span className='timeline_message_icon'>
                                            <TbUserPlus />
                                          </span>
                                          <span className='timeline_username'>
                                            {document.user.name}
                                          </span>
                                          select as admin.
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
                    </>
                  )}
                </p>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Timeline;
