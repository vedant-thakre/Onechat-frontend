import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { Spinner, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "https://onechat-oeah.onrender.com/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <button
        className="loginButtons"
        style={{
          backgroundColor: "#3c3c3c",
          borderRadius: "5px",
          width: "100%",
          marginTop: "15px",
          color: "white",
          padding: "7px",
          fontSize: "19px",
          fontWeight: "500",
          cursor: "pointer",
        }}
        onClick={submitHandler}
        isLoading={loading}
        onMouseOver={(e) => {
          // Change the background color on hover
          e.target.style.backgroundColor = "#575757";
        }}
        onMouseOut={(e) => {
          // Restore the original background color on hover out
          e.target.style.backgroundColor = "#3c3c3c";
        }}
      >
        {loading ? (
          <Spinner size="md" w={6} h={6} marginTop={1} />
        ) : (
          <>Login</>
        )}
      </button>
      <button
        className="loginButtons"
        style={{
          backgroundColor: "#3c3c3c",
          borderRadius: "5px",
          width: "100%",
          color: "white",
          padding: "7px",
          fontSize: "19px",
          fontWeight: "500",
          cursor: "pointer",
        }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("1234");
        }}
        onMouseOver={(e) => {
          // Change the background color on hover
          e.target.style.backgroundColor = "#575757";
        }}
        onMouseOut={(e) => {
          // Restore the original background color on hover out
          e.target.style.backgroundColor = "#3c3c3c";
        }}
      >
        Get Guest User Credentials
      </button>
    </VStack>
  );
};

export default Login;
