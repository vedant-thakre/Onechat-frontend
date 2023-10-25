import { AddIcon } from "@chakra-ui/icons";
import { Flex, Box, Stack, Text, Avatar, Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const defaultGroupChatImage =
  "https://1.bp.blogspot.com/-TCjM5XzRUSg/X75w1adIN3I/AAAAAAAAGPM/n1tW2tKMr-MsL2sCf8uneKIGMHj0TLT3QCNcBGAsYHQ/s16000/Screenshot_2020-11-25-21-38-44-66.png";


const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats, mode } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "https://onechat-oeah.onrender.com/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={mode ? "#343a40" : "white"}
      color={mode ? "white" : "black"}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            bg={mode ? "#272c31" : ""}
            color={mode ? "#efefef" : "black"}
            _hover={{ backgroundColor: mode ? "#49525b" : "#f0f0f0" }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg={mode ? "#212529" : "#F8F8F8"}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={mode ? "#343a40" : "#E8E8E8"}
                borderWidth={selectedChat === chat ? "1px" : "0px"}
                style={{ borderColor: mode ? "#4a515b" : "#c8c8c8" }}
                color={mode ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Flex align="center">
                  {chat.isGroupChat ? (
                    // Display default image for group chat
                    <Avatar
                      size="md"
                      name="Group Chat"
                      src={defaultGroupChatImage}
                    />
                  ) : (
                    chat.users.map((participant) => {
                      // Check if the participant is not the logged-in user
                      if (participant._id !== loggedUser._id) {
                        return (
                          // Fetch and display the profile picture of the other person
                          <Flex key={participant._id} align="center">
                            <Avatar
                              size="md"
                              name={participant.name}
                              src={participant.pic}
                            />
                          </Flex>
                        );
                      }
                      return null; // Return null for the logged-in user
                    })
                  )}

                  <Flex direction="column" ml={2}>
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName.toUpperCase()}
                    </Text>
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        {chat.latestMessage.content.length > 30
                          ? chat.latestMessage.content.substring(0, 31) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
