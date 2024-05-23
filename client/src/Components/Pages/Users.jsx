import { useState, useEffect } from "react";
import axios from "axios";
import UserProfile from "./UserProfile";
import { SimpleGrid, Center, Heading, VStack } from "@chakra-ui/react";

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8080/profile/users").then(
      (res) => {
        setProfiles(res.data);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);
  return (
    <>
      <Center py={6}>
        <VStack>
          <Heading as="h1" size="xl">
            Registered Users
          </Heading>

          <SimpleGrid columns={[1, 1, 2, 3, 4, 5]} spacing={10}>
            {profiles.map((profile) => (
              <UserProfile key={profile.email} profile={profile} />
            ))}
          </SimpleGrid>
        </VStack>
      </Center>
    </>
  );
}
