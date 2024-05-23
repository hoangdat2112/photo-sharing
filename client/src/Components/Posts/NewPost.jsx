import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  Stack,
  Box,
  VStack,
  useColorModeValue,
  Image,
  Heading,
  Center,
  useToast,
} from "@chakra-ui/react";
import { useState, useContext, useRef } from "react";
import { UserContext } from "../../context";
import axios from "axios";

const NewPost = ({ isOpen, onOpen, onClose, fetchPosts }) => {
  const initialRef = useRef();
  const [user] = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");

  const toast = useToast();

  const handleCreatePost = async () => {
    await axios
      .post("http://localhost:8080/posts/createPost", {
        author: user.user.id,
        name: user.user.firstName + " " + user.user.lastName,
        title: title,
        description: description,
        postPicture: imageURL,
      })
      .then((res) => {
        setImageURL("");
        setTitle("");
        setDescription("");
        onClose();
        toast({
          title: "Successfully created a new post",
          description: "",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        fetchPosts();
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Unable to create new post.",
          description: err.response.data.errors[0],
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
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
    <>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="" />
        <ModalContent>
          <ModalHeader>
            <Heading>
              <Box
                h={"210px"}
                bg={"gray.100"}
                mt={-6}
                mx={-6}
                mb={4}
                pos={"relative"}
              >
                <Image
                  boxSize="150px"
                  objectFit="cover"
                  w="100%"
                  h="100%"
                  src={imageURL}
                />
              </Box>
              <Center>
                <VStack>
                  <Heading>Post Image</Heading>
                  <Input
                    type="file"
                    label="Upload"
                    py={1}
                    onChange={(event) => {
                      uploadImage(event.target.files[0]);
                    }}
                  />
                </VStack>
              </Center>
            </Heading>
          </ModalHeader>
          <ModalCloseButton color={"black"} />
          <ModalBody pb={0}>
            <Stack
              spacing={6}
              w={"full"}
              maxW={"md"}
              rounded={"xl"}
              p={6}
              my={2}
            >
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Name"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  isDisabled
                  value={
                    user.user
                      ? user.user.firstName + " " + user.user.lastName
                      : ""
                  }
                />
              </FormControl>
              <FormControl id="title" isRequired>
                <FormLabel>Title of post</FormLabel>
                <Input
                  placeholder="Title"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={30}
                />
              </FormControl>
              <FormControl id="description" isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Description"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={90}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              bg={useColorModeValue("blue.400", "red.400")}
              mr={3}
              _hover={{
                bg: useColorModeValue("blue.300", "red.300"),
              }}
              onClick={handleCreatePost}
            >
              Create Post
            </Button>
            <Button
              bg={"teal.500"}
              _hover={{
                bg: "teal.400",
              }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewPost;
