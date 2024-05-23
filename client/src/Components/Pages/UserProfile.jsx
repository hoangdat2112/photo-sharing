import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function SocialProfileSimple({ profile }) {
  return (
    <Center py={6}>
      <Box
        maxW={"320px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"lg"}
        p={6}
        textAlign={"center"}
      >
        <Avatar
          size={"xl"}
          src={profile.profilePicture}
          alt={"Avatar Alt"}
          mb={4}
          pos={"relative"}
        />
        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {profile.firstName + " " + profile.lastName}
        </Heading>
        <Text fontWeight={600} color={"gray.500"} mb={4}>
          {profile.email}
        </Text>
      </Box>
    </Center>
  );
}
