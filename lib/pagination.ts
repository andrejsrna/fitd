// lib/utils/pagination.ts

export type PaginationItem = number | 'LEFT_ELLIPSIS' | 'RIGHT_ELLIPSIS';

interface PaginationRangeProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number; // Počet stránok na každej strane aktuálnej stránky
}

export function getPaginationRange({
  currentPage,
  totalPages,
  siblingCount = 1,
}: PaginationRangeProps): PaginationItem[] {
  const totalPageNumbers = siblingCount * 2 + 5;

  // Ak je celkový počet stránok menší alebo rovný ako maximálny počet viditeľných stránok, zobraz všetky
  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  const paginationRange: PaginationItem[] = [];

  paginationRange.push(firstPageIndex);

  if (shouldShowLeftEllipsis) {
    paginationRange.push('LEFT_ELLIPSIS');
  } else {
    for (let i = 2; i < leftSiblingIndex; i++) {
      paginationRange.push(i);
    }
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    paginationRange.push(i);
  }

  if (shouldShowRightEllipsis) {
    paginationRange.push('RIGHT_ELLIPSIS');
  } else {
    for (let i = rightSiblingIndex + 1; i < lastPageIndex; i++) {
      paginationRange.push(i);
    }
  }

  paginationRange.push(lastPageIndex);

  // Odstránenie duplicitných hodnôt
  return Array.from(new Set(paginationRange));
}
