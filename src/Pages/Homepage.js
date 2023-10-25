import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Image,
  Center,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import LogoDark from "../assets/Darklogo.png";

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="xl">
      <Center h="100vh">
        <Box
          bg="white"
          w="100%"
          pr={4}
          pl={4}
          pb={4}
          pt={2}
          borderRadius="lg"
          borderWidth="1px"
        >
          <Image w="180px" mx="auto" src={LogoDark} alt="Logo" mb={5} />
          <Tabs isFitted variant="soft-rounded">
            <TabList mb="1em">
              <Tab _selected={{ color: "black", bg: "#808080" }}>Login</Tab>
              <Tab _selected={{ color: "black", bg: "#808080" }}>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Center>
    </Container>
  );
}

export default Homepage;
