// components/ui/pagination/PaginationComponent.tsx

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem as UI_PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { getPaginationRange, PaginationItem as RangePaginationItem } from "@/lib/pagination";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  category?: string;
  tag?: string;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  category,
  tag,
}) => {
  const paginationRange: RangePaginationItem[] = getPaginationRange({
    currentPage,
    totalPages,
    siblingCount: 1,
  });

  return (
    <Pagination>
      <PaginationContent>
        <UI_PaginationItem>
          <PaginationPrevious
            inactive={currentPage === 1}
            href={`/clanky?page=${Math.max(currentPage - 1, 1)}${
              category ? `&category=${category}` : ""
            }${tag ? `&tag=${tag}` : ""}`}
          />
        </UI_PaginationItem>

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === "LEFT_ELLIPSIS" || pageNumber === "RIGHT_ELLIPSIS") {
            return (
              <UI_PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </UI_PaginationItem>
            );
          }

          return (
            <UI_PaginationItem key={`page-${pageNumber}`}>
              <PaginationLink
                href={`/clanky?page=${pageNumber}${category ? `&category=${category}` : ""}${
                  tag ? `&tag=${tag}` : ""
                }`}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            </UI_PaginationItem>
          );
        })}

        <UI_PaginationItem>
          <PaginationNext
            inactive={currentPage === totalPages}
            href={`/clanky?page=${Math.min(currentPage + 1, totalPages)}${
              category ? `&category=${category}` : ""
            }${tag ? `&tag=${tag}` : ""}`}
          />
        </UI_PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
