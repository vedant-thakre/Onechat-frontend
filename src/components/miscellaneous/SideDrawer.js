import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import { Image } from "@chakra-ui/react";
import LogoLight from "../../assets/Lightlogo.png";
import LogoDark from "../../assets/Darklogo.png";
import Dark from "../../assets/dark.png";
import Light from "../../assets/light.png";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
    mode,
    setMode,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `https://onechat-oeah.onrender.com/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `https://onechat-oeah.onrender.com/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg={mode ? "#212529" : "white"}
        w="100%"
        px={{ base: "0px", sm: "5px", md: "10x" }}
        p="5px 0px 5px 0px"
        borderWidth="5px"
        borderRadius="0px 0px 10px 10px"
        style={{ borderColor: mode ? "#1a1d20" : "#d2d2d2" }}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            onClick={onOpen}
            px={{ base: 0, sm: 3 }}
            _hover={{ backgroundColor: mode ? "#282c31" : "#f0f0f0" }}
          >
            <i
              className="fas fa-search"
              style={{ color: mode ? "#DADADA" : "black" }}
            />
            <Text
              display={{ base: "none", md: "flex" }}
              px={{ base: 2, sm: 3, md: 4 }}
              color={mode ? "white" : "black"}
            >
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Image
          w={{
            base: "7.5em",
            sm: "11em",
            md: "13em",
            lg: "14em",
            xl: "14em",
          }}
          src={mode ? LogoLight : LogoDark}
          alt="Logo"
          mb={1.5}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          {mode ? (
            <Image
              src={Light}
              mx={{ base: "10px", sm: "5px" }}
              alt="light"
              w={"25px"}
              cursor={"pointer"}
              onClick={() => {
                setMode((prev) => !prev);
              }}
            />
          ) : (
            <Image
              src={Dark}
              mx={{ base: "1px", sm: "5px", md: "5px" }}
              alt="light"
              w={"25px"}
              cursor={"pointer"}
              onClick={() => {
                setMode((prev) => !prev);
              }}
            />
          )}
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon
                fontSize="2xl"
                m={1}
                color={mode ? "#DADADA" : "black"}
              />
            </MenuButton>
            <MenuList
              pl={2.5}
              bg={mode ? "#212529" : "white"}
              style={{ borderColor: mode ? "#495057" : "#d2d2d2" }}
            >
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  bg={mode ? "#212529" : "white"}
                  color={mode ? "white" : "black"}
                  _hover={{ backgroundColor: mode ? "#343a40" : "#f0f0f0" }}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              px={{ base: 1, md: 4, sm: 3 }}
              as={Button}
              bg={mode ? "#212529" : "white"}
              _hover={{ backgroundColor: mode ? "#282c31" : "#f0f0f0" }}
              _expanded={{ bg: mode ? "#282c31" : "#f0f0f0" }}
              rightIcon={<ChevronDownIcon color={mode ? "#DADADA" : "black"} />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList
              bg={mode ? "#212529" : "white"}
              style={{ borderColor: mode ? "#495057" : "#d2d2d2" }}
            >
              <ProfileModal user={user}>
                <MenuItem
                  bg={mode ? "#212529" : "white"}
                  color={mode ? "white" : "black"}
                  _hover={{ backgroundColor: mode ? "#343a40" : "#f0f0f0" }}
                >
                  My Profile
                </MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                onClick={logoutHandler}
                bg={mode ? "#212529" : "white"}
                color={mode ? "white" : "black"}
                _hover={{ backgroundColor: mode ? "#343a40" : "#f0f0f0" }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        placement="left"
        onClose={onClose}
        isOpen={isOpen}
        bg={mode ? "#343a40" : "white"}
      >
        <DrawerOverlay />
        <DrawerContent
          bg={mode ? "#343a40" : "white"}
          color={mode ? "white" : "black"}
        >
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                onClick={handleSearch}
                bg={mode ? "#272c31" : ""}
                color={mode ? "#efefef" : "black"}
                _hover={{ backgroundColor: mode ? "#49525b" : "#f0f0f0" }}
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
