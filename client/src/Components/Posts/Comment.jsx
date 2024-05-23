import React, { useContext } from "react";
import {
  HStack,
  Text,
  Stack,
  useColorModeValue,
  Divider,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import dateFormat from "dateformat";
import { DeleteIcon } from "@chakra-ui/icons";
import { UserContext } from "../../context";
import axios from "axios";

const Comment = ({
  commentId,
  author,
  authorName,
  body,
  date,
  fetchComments,
}) => {
  const [user] = useContext(UserContext);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = () => {
    axios
      .delete(`http://localhost:8080/comments/${commentId}`)
      .then((res) => {
        onClose();
        toast({
          title: "Successfully deleted the comment",
          description: "",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        fetchComments();
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Unable to delete the comment",
          description: err.response.data.errors[0],
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };
  return (
    <>
      <Stack py={2}>
        <HStack direction={"column"} spacing={0} fontSize={"xs"}>
          <Text
            fontWeight={600}
            color={useColorModeValue("blue.400", "red.400")}
            textAlign={"center"}
          >
            {authorName}
          </Text>
          <Text
            color={useColorModeValue("gray.700", "white.300")}
            fontSize={"xs"}
            px={2}
          >
            {dateFormat(date, "mmmm dS, yyyy, h:MM TT")}
          </Text>
          {author === user.user.id && (
            <IconButton
              onClick={onOpen}
              size={"xs"}
              aria-label="delete"
              icon={<DeleteIcon />}
            />
          )}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete Comment</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>{"Are your sure you want to delete the comment?"}</Text>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme={"red"}
                  onClick={() => handleDelete()}
                  mr={3}
                >
                  Delete
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </HStack>
        <Text
          color={useColorModeValue("gray.700", "white.300")}
          fontSize={"sm"}
        >
          {body}
        </Text>
      </Stack>

      <Divider />
    </>
  );
};

export default Comment;
