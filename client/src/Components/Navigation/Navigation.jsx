import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import { UserContext } from "../../context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Links = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Profiles",
    url: "/profiles",
  },
];

export default function Navigation() {
  const NavLink = ({ children, url }) => (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      onClick={() => {
        navigate(url);
      }}
      // href={url}
    >
      {children}
    </Link>
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem("token");
    setUser({ user: null, loading: false, error: null });
    navigate("/login");
  };
  console.log({user1:user})

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>

            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link.name} url={link.url}>
                  {link.name}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {!user.user && (
              <Button
                variant={"ghost"}
                color={"teal"}
                size={"sm"}
                mr={4}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
            {user.user && (
              <Heading size="xs" mr={4} color={"#4299E1"}>
                {user.user.fullName }
              </Heading>
            )}
            {!user.user && (
              <Button
                variant={"solid"}
                bg={"red.400"}
                color={"white"}
                size={"sm"}
                mr={4}
                _hover={{
                  bg: "red.300",
                }}
                onClick={() => navigate("/signup")}
              >
                Signup
              </Button>
            )}
            {user.user && (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar size={"sm"} src={user.user.profilePicture} />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => navigate("/editprofile")}>
                    Edit Profile
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleSignout}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
