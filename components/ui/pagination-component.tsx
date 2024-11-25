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
    author?: string;
    tag?: string;
  }
  
  const PaginationComponent: React.FC<PaginationComponentProps> = ({
    currentPage,
    totalPages,
    category,
    author,
    tag,
  }) => {
    const paginationRange: RangePaginationItem[] = getPaginationRange({
      currentPage,
      totalPages,
      siblingCount: 1, // Môžete upraviť podľa potreby
    });
  
    console.log('Pagination Range:', paginationRange); // Pre debugging
  
    return (
      <Pagination>
        <PaginationContent>
          {/* Predchádzajúce tlačidlo */}
          <UI_PaginationItem>
            <PaginationPrevious
              inactive={currentPage === 1}
              href={`/clanky?page=${Math.max(currentPage - 1, 1)}${
                category ? `&category=${category}` : ""
              }${author ? `&author=${author}` : ""}${
                tag ? `&tag=${tag}` : ""
              }`}
            />
          </UI_PaginationItem>
  
          {/* Čísla stránok a ellipsy */}
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === 'LEFT_ELLIPSIS' || pageNumber === 'RIGHT_ELLIPSIS') {
              return (
                <UI_PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </UI_PaginationItem>
              );
            }
  
            return (
              <UI_PaginationItem key={`page-${pageNumber}`}>
                <PaginationLink
                  href={`/clanky?page=${pageNumber}${
                    category ? `&category=${category}` : ""
                  }${author ? `&author=${author}` : ""}${
                    tag ? `&tag=${tag}` : ""
                  }`}
                  isActive={pageNumber === currentPage}
                >
                  {pageNumber}
                </PaginationLink>
              </UI_PaginationItem>
            );
          })}
  
          {/* Nasledujúce tlačidlo */}
          <UI_PaginationItem>
            <PaginationNext
              inactive={currentPage === totalPages}
              href={`/clanky?page=${Math.min(currentPage + 1, totalPages)}${
                category ? `&category=${category}` : ""
              }${author ? `&author=${author}` : ""}${
                tag ? `&tag=${tag}` : ""
              }`}
            />
          </UI_PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  
  export default PaginationComponent;