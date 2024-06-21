import { Box, Button, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

export default function Paginator({
  onPageChange,
  currentPageNumber,
  pageSize,
  totalItemsCount,
}) {
  let pagesCount = Math.ceil(totalItemsCount / pageSize);
  let pageNumbers = [];
  for (let i = 1; i <= pagesCount; i++) {
    pageNumbers.push(i);
  }

  return (pagesCount > 1
    && <Box pt='20px' textAlign='center'>
      {pagesCount > 4
        && <IconButton
          aria-label="First page"
          icon={<ArrowLeftIcon />}
          mx='20px'
          onClick={() => onPageChange(1)}
          isDisabled={currentPageNumber < 3}
        />
      }

      <IconButton
        aria-label="Previous page"
        icon={<ChevronLeftIcon />}
        mx='3px'
        onClick={() => onPageChange(currentPageNumber - 1)}
        isDisabled={currentPageNumber === 1}
      />
      <Button mx='3px' isDisabled>{currentPageNumber}</Button>
      <IconButton
        aria-label="Next page"
        icon={<ChevronRightIcon />}
        mx='3px'
        onClick={() => onPageChange(currentPageNumber + 1)}
        isDisabled={currentPageNumber === pagesCount || totalItemsCount === 0}
      />
      {pagesCount > 4
        && <IconButton
          aria-label="Last page"
          icon={<ArrowRightIcon />}
          mx='20px'
          onClick={() => onPageChange(pagesCount)}
          isDisabled={currentPageNumber > pagesCount - 2}
        />
      }
    </Box>
  )
}
