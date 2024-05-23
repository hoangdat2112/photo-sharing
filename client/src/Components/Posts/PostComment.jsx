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
  Button,
  Textarea,
  useToast,
  Center,
  Heading,
} from "@chakra-ui/react";

import { ChatIcon } from "@chakra-ui/icons";
import Comments from "./Comments";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../context";
import axios from "axios";

export default function InitialFocus({ postId, isOpen, onOpen, onClose }) {
  const initialRef = useRef();
  const [user] = useContext(UserContext);
  const [body, setBody] = useState("");
  const [comments, setComments] = useState([]);

  const toast = useToast();

  const fetchComments = () => {
    axios.get(`http://localhost:8080/comments/${postId}`).then(
      (res) => {
        let comments = res.data;
        comments.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        setComments(comments);
      },
      (err) => {
        console.warn(err);
      },
    );
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmitComment = () => {
    axios
      .post("http://localhost:8080/comments/createComment", {
        postId: postId,
        author: user.user.id,
        authorName: user.user.firstName + " " + user.user.lastName,
        body: body,
      })
      .then(
        (res) => {
          setBody("");
          toast({
            title: "Comment created successfully!",
            description: "",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          fetchComments();
        },
        (error) => {
          toast({
            title: "Unable to create comment",
            description: error.response.data.errors[0],
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        },
      );
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
            <Center>
              <Heading fontSize={"xx-large"} mb={5}>
                {" "}
                Comments{" "}
              </Heading>
            </Center>
            <Comments
              setComments={setComments}
              comments={comments}
              postId={postId}
              fetchComments={fetchComments}
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>New Comment</FormLabel>
              <Textarea
                placeholder="Enter comment"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                maxLength={75}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme={"blue"}
              mr={3}
              leftIcon={<ChatIcon />}
              onClick={handleSubmitComment}
            >
              Post Comment
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
