import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Link,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import CSS file
import "./App.css";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    retypePassword: "",
    fullName: "",
    dateOfBirth: "",
    address: "",
    isAccepted: false,
  });
  const [showError, setError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignUp = async () => {
    if (formData.password.length < 3) {
      setError("Password must be at least 3 characters long");
      return;
    }
    if (formData.password !== formData.retypePassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.isAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }
  
    await axios
      .post("http://localhost:8080/auth/signup", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        isAccepted: formData.isAccepted,
      })
      .then(
        (res) => {
          console.log("Registered successfully!");
          navigate("/login");
  
          toast({
            title: "Registered successfully!",
            description: "Login to access the site.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        },
        (error) => {
          setError(error.response.data.errors[0]);
          toast({
            title: "Unable to create account",
            description: "Please try again with the required fieldss.",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      );
  };
  

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      className="container"
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading className="register-header" fontSize={"4xl"} textAlign={"center"}>
            Sign Up
          </Heading>
        </Stack>
        <Box className="register-form">
          <Stack spacing={4}>
            <FormControl id="emailr" isRequired>
              <FormLabel className="label-text">Email address</FormLabel>
              <Input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
              <Box className="divider-nospace"></Box>
            </FormControl>
            <FormControl id="password" isRequired className="password-field">
              <FormLabel className="label-text">Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="at least 3 characters"
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Box className="divider-nospace"></Box>
              {formData.password.length < 3 && (
                <Text color="red">Password must be at least 3 characters</Text>
              )}
            </FormControl>
            <FormControl id="retypePassword" isRequired className="password-field">
              <FormLabel className="label-text">Retype Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="retypePassword"
                  value={formData.retypePassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Retype your password"
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Box className="divider-nospace"></Box>
              {formData.password !== formData.retypePassword && (
                <Text color="red">Passwords do not match</Text>
              )}
            </FormControl>
            <FormControl id="fullName" isRequired>
              <FormLabel className="label-text">Full Name</FormLabel>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-control"
              />
              <Box className="divider-nospace"></Box>
            </FormControl>
            <FormControl id="dateOfBirth" isRequired>
              <FormLabel className="label-text">Date of Birth</FormLabel>
              <Input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="form-control"
              />
              <Box className="divider-nospace"></Box>
            </FormControl>
            <FormControl id="address">
              <FormLabel className="label-text">Address</FormLabel>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
              />
              <Box className="divider-nospace"></Box>
            </FormControl>
            <FormControl id="isAccepted" isRequired>
              <Checkbox
                name="isAccepted"
                isChecked={formData.isAccepted}
                onChange={handleChange}
                className="form-check-input"
              >
                <Text className="checkbox-text">I accept the terms and conditions</Text>
              </Checkbox>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                className="register-button"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link color={"#69f4b5"} onClick={() => navigate("/login")}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
