// import React from 'react'

// const NavbarAdmin = () => {
//   return (
//     <header>
//       <Box>
//         <Flex
//           pos={"fixed"}
//           w={"full"}
//           zIndex={10}
//           bg={"white"}
//           color={"#1c1c1c"}
//           minH={"60px"}
//           borderBottom={1}
//           borderStyle={"solid"}
//           borderColor={"#F9CDA6"}
//           align={"center"}
//           display={"flex"}
//           justifyContent={"space-between"}
//           px={"8"}
//         >
//           <Image
//             src={Logo}
//             h={"32px"}
//             _hover={{ filter: "brightness(150%)", transition: "300ms" }}
//           />
//           <Menu>
//             <MenuButton
//               as={Button}
//               rounded={"full"}
//               variant={"link"}
//               cursor={"pointer"}
//               minW={0}
//             >
//               <Avatar size={"sm"} name="User" src={getImageUrl(avatar)} />
//             </MenuButton>
//             <MenuList>
//               <Link as={"button"} onClick={onOpenAvatar}>
//                 <MenuItem>Change Avatar</MenuItem>
//               </Link>
//               <MenuDivider />
//               <Link onClick={() => handleLogout()}>
//                 <MenuItem color={"red"}>Sign Out</MenuItem>
//               </Link>
//             </MenuList>
//           </Menu>
//         </Flex>
//       </Box>
//       {/* <ChangeAvatarModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} /> */}
//     </header>
//   );
// }

// export default NavbarAdmin