import React from "react";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
const ConfirmDelete = ({ isDeleteOpen, onDeleteClose, handleDelete }) => {
  return (
    <>
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{"Are you sure you want to delete the post?"}</Text>
          </ModalBody>
          <ModalFooter>
            <Button color={"red.200"} onClick={() => handleDelete()} mr={3}>
              Delete
            </Button>
            <Button color={"gray.400"} onClick={onDeleteClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmDelete;
