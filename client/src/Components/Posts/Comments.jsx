import React from "react";
import Comment from "./Comment";
import { Box } from "@chakra-ui/react";

const Comments = ({ postId, comments, setComments, fetchComments }) => {
  return (
    <Box>
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          commentId={comment._id}
          author={comment.author}
          authorName={comment.authorName}
          body={comment.body}
          date={comment.date}
          fetchComments={fetchComments}
        />
      ))}
    </Box>
  );
};

export default Comments;
