import {
  Button,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { BsPersonCircle } from "react-icons/bs";

export default function ForgetPassword() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}
      <Button
        mt={"20px"}
        ml={{ sm: "170px", md: "230px", lg: "330px" }}
        variant={"none"}
        w={"100px"}
        onClick={onOpen}
        color={"#bc6c25"}
        fontSize={{ sm: "12px", md: "16px", lg: "16px" }}
      >
        Forgot Password ?
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl
              // isInvalid={formik.touched.email && formik.errors.email}
              >
                <InputGroup mt={"20px"}>
                  <InputLeftElement>
                    <BsPersonCircle />
                  </InputLeftElement>
                  <Input
                    placeholder="Email"
                    isRequired={true}
                    borderColor={"black"}
                    id="email"
                    name="email"
                    // value={formik.values.email}
                    // onChange={formik.handleChange}
                  ></Input>
                </InputGroup>
                {/* {formik.touched.email && formik.errors.email && (
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              )} */}
              </FormControl>

              <ModalFooter>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
