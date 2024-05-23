import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  Image,
  useColorModeValue,
  useDisclosure,
  IconButton,
  useToast,
  HStack,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { DeleteIcon, ChatIcon } from "@chakra-ui/icons";
import PostComment from "../Posts/PostComment";
import dateFormat from "dateformat";
import { UserContext } from "../../context";
import axios from "axios";
import ConfirmDelete from "./ConfirmDelete";

export default function BlogPostWithImage({
  postId,
  author,
  authorName,
  authorPicture,
  title,
  description,
  date,
  postPicture,
  fetchPosts,
}) {
  const [user] = useContext(UserContext);
  const {
    isOpen: isCommentOpen,
    onOpen: onCommentOpen,
    onClose: onCommentClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const toast = useToast();

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8080/posts/${postId}`)
      .then((res) => {
        onDeleteClose();
        toast({
          title: "Successfully deleted the post",
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
          title: "Unable to delete the post",
          description: "",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <Center py={6}>
        <Box
          maxW={"445px"}
          minW={"445px"}
          maxH={"445px"}
          minH={"445px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          rounded={"md"}
          p={6}
          overflowY={"hidden"}
          cursor={"pointer"}
          _hover={{
            transform: "scale(1.01)",
          }}
        >
          <Box
            h={"210px"}
            bg={"gray.100"}
            mt={-6}
            mx={-6}
            mb={6}
            pos={"relative"}
          >
            <Image
              boxSize="150px"
              objectFit="cover"
              w="100%"
              h="100%"
              src={postPicture}
            />
          </Box>
          <Stack minH={"120px"}>
            <Text
              color={"green.500"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={"sm"}
              letterSpacing={1.1}
            >
              Post
            </Text>
            <Heading
              color={useColorModeValue("gray.700", "white")}
              fontSize={"2xl"}
              fontFamily={"body"}
            >
              {title}
            </Heading>
            <Text color={"gray.500"}>{description}</Text>
          </Stack>
          <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
            <Avatar src={authorPicture} alt={"Author"} />
            <Stack direction={"column"} spacing={0} fontSize={"sm"}>
              <Text
                fontWeight={600}
                color={useColorModeValue("blue.400", "red.400")}
              >
                {authorName}
              </Text>
              <Text color={"gray.500"}>
                {dateFormat(date, "mmmm dS, yyyy, h:MM TT")}
              </Text>
            </Stack>
            <HStack align={"right"}>
              <IconButton
                onClick={() => {
                  onCommentOpen();
                }}
                aria-label="delete"
                icon={<ChatIcon />}
                align={"right"}
              />
              {author === user.user.id && (
                <IconButton
                  onClick={() => {
                    onDeleteOpen();
                  }}
                  aria-label="delete"
                  icon={<DeleteIcon />}
                  align={"right"}
                />
              )}
            </HStack>
          </Stack>
        </Box>
      </Center>

      <PostComment
        postId={postId}
        isOpen={isCommentOpen}
        onOpen={onCommentOpen}
        onClose={onCommentClose}
      />

      <ConfirmDelete
        isDeleteOpen={isDeleteOpen}
        onDeleteClose={onDeleteClose}
        handleDelete={handleDelete}
      />
    </>
  );
}
