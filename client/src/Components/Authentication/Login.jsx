import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../../context";
import axios from "axios";

export default function SimpleCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setError] = useState("");
  // eslint-disable-next-line
  const [user, setUser] = useContext(UserContext);

  const navigate = useNavigate();
  const toast = useToast();
  const handleLogin = async () => {
    await axios
      .post("http://localhost:8080/auth/login", {
        email: email,
        password: password,
      })
      .then(
        (res) => {
          console.log("Logged in successfully!");
          localStorage.setItem("token", res.data.token);
          navigate("/");
          setUser({ user: res.data.user, loading: false, error: null });
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.token}`;

          toast({
            title: "Login successfully",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        },
        (error) => {
          setError(error.response.data.errors[0]);
          toast({
            title: "Unable to sign in",
            description: "Please try again with the required fields.",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        },
      );
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Welcome back, Sign in.</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value.replace(/[^a-zA-Z0-9@.]/g, ""));
                }}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
              </Stack>
              {showError && <FormLabel color={"red"}> {showError}</FormLabel>}
              <Button
                bg={"red.400"}
                color={"white"}
                _hover={{
                  bg: "red.300",
                }}
                onClick={handleLogin}
              >
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                New user?{" "}
                <Link color={"blue.400"} onClick={() => navigate("/signup")}>
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
