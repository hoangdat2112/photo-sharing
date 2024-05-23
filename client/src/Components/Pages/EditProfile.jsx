import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Box,
  InputGroup,
  useToast,
  InputRightElement,
} from "@chakra-ui/react";
import { SmallCloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserProfileEdit() {
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line
  const [user, setUser] = useContext(UserContext);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const[dateOfBrith,setDateOfBrith] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showError, setError] = useState("");
  const [imageURL, setImageURL] = useState("");
  const ref = useRef();

  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    if (user.user) {
      setFullName(user.user.fullName);
      setAddress(user.user.address);
      setDateOfBrith(user.user.dateOfBrith)
      setEmail(user.user.email);
      setImageURL(user.user.profilePicture);
    }
  }, [user]);

  const handleProfileChange = () => {
    axios
      .put(`http://localhost:8080/profile/user=${user.user.id}`, {
        fullName:fullName,
        address:address,
        dateOfBrith:dateOfBrith,
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword,
        profilePicture: imageURL,
      })
      .then(
        (res) => {
          console.log("Successfully updated profile!");
          setError(null);
          setImageURL(null);
          setOldPassword("");
          setNewPassword("");
          navigate("/");
          setUser({
            user: res.data.updatedUser,
            loading: false,
            error: null,
          });
          ref.current.value = "";
          toast({
            title: "Profile updated succesfully!",
            description: "",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        },
        (error) => {
          setError(error.response.data.errors[0]);
          toast({
            title: "Unable to update profile.",
            description: "Please try again with the required fields.",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      );
  };

  const uploadImage = async (file) => {
    let axiosInstance = axios.create();
    delete axiosInstance.defaults.headers.common["Authorization"];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my-uploads");

    await axiosInstance
      .post(`https://api.cloudinary.com/v1_1/teamcyd/image/upload`, formData)
      .then((res) => res.data.secure_url)
      .then((url) => setImageURL(url))
      .catch((err) => console.warn(err));
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading
          lineHeight={1.1}
          fontSize={{ base: "2xl", sm: "3xl" }}
          color={useColorModeValue("blue.400", "red.400")}
        >
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <FormLabel>User Icon</FormLabel>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar size="xl" src={imageURL}>
                <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-10px"
                  colorScheme="red"
                  aria-label="remove Image"
                  icon={
                    <SmallCloseIcon
                      onClick={() => {
                        setImageURL(user.user.profilePicture);
                        ref.current.value = "";
                      }}
                    />
                  }
                />
              </Avatar>
            </Center>
            <Center w="full">
              <Input
                type="file"
                label="Upload"
                py={1}
                ref={ref}
                onChange={(event) => {
                  uploadImage(event.target.files[0]);
                }}
              />
            </Center>
          </Stack>
        </FormControl>
        <Stack spacing={4}>
          <HStack>
            <Box>
              <FormControl id="fullName" isRequired>
                <FormLabel>FullName</FormLabel>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value.replace(/[^a-zA-Z]/g, ""));
                  }}
                />
              </FormControl>
            </Box>
            <Box>
            <FormControl id="dateOfBrith" isRequired>
                <FormLabel>DateOfBrith</FormLabel>
                <Input
                  type="date"
                  value={dateOfBrith}
                  onChange={(event) => {
                    setDateOfBrith(event.target.value.replace(/[^a-zA-Z]/g, ""));
                  }}
                />
              </FormControl>
            </Box>
          </HStack>
              <FormControl id="address" isRequired>
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value.replace(/[^a-zA-Z]/g, ""));
                  }}
                />
              </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value.replace(/[^a-zA-Z0-9@.]/g, ""));
              }}
            />
          </FormControl>
          <FormControl id="oldPassword" isRequired>
            <FormLabel>Old Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                onChange={(event) => {
                  setOldPassword(event.target.value);
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
          <FormControl id="newPassword" isRequired>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                onChange={(event) => setNewPassword(event.target.value)}
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
        </Stack>
        {showError && <FormLabel color={"red"}> {showError}</FormLabel>}
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={handleProfileChange}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
