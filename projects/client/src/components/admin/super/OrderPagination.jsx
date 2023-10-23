import { Button, Flex } from "@chakra-ui/react";
import React from "react";

export const OrderPagination = ({ page, index, setIndex }) => {
  const handlePreviousPage = () => {
    if (index > 1) {
      setIndex(index - 1);
    }
  };

  const handleNextPage = () => {
    if (index < page) {
      setIndex(index + 1);
    }
  };

  const handlePageChange = (pageIndex) => {
    setIndex(pageIndex);
  };

  const renderPageButtons = () => {
    const totalPages = page;
    const startPage = Math.max(1, index - 2);
    const endPage = Math.min(startPage + 4, totalPages);

    const pageButtons = [];
    for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
      pageButtons.push(
        <Button
          key={pageNum}
          variant="solid"
          onClick={() => handlePageChange(pageNum)}
          isActive={index === pageNum}
          disabled={index === pageNum}
          display={"inline-flex"}
          fontSize={"sm"}
          fontWeight={700}
          color={"white"}
          bg={"#59981A"}
          rounded={"lg"}
          _hover={{
            bg: "brand.hover",
          }}
          _active={{
            bg: "brand.main",
          }}
        >
          {pageNum}
        </Button>
      );
    }

    return pageButtons;
  };

  const pageButtons = renderPageButtons();
  return (
    <Flex justifyContent="center" py={4} gap={2}>
      <Button
        onClick={handlePreviousPage}
        display={"inline-flex"}
        fontSize={"sm"}
        fontWeight={700}
        color={"white"}
        bg={"brand.main"}
        rounded={"lg"}
        _hover={{
          bg: "brand.hover",
        }}
        _active={{
          bg: "brand.active",
        }}
      >
        Previous
      </Button>
      {pageButtons}
      <Button
        onClick={handleNextPage}
        display={"inline-flex"}
        fontSize={"sm"}
        fontWeight={700}
        color={"white"}
        bg={"brand.main"}
        rounded={"lg"}
        _hover={{
          bg: "brand.hover",
        }}
        _active={{
          bg: "brand.active",
        }}
      >
        Next
      </Button>
    </Flex>
  );
};
